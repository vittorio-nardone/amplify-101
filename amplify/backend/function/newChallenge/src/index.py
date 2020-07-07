import boto3
from botocore.exceptions import ClientError
import os
import json
import time
import uuid 
import random
import decimal

dynamodb = boto3.resource('dynamodb')
scoreboard_table = dynamodb.Table(os.environ['STORAGE_SCOREBOARD_NAME'])
challenges_table = dynamodb.Table(os.environ['STORAGE_CHALLENGES_NAME'])

# Helper class to Decimals in an arbitrary object
def replace_decimals(obj):
    if isinstance(obj, list):
        for i in range(len(obj)):
            obj[i] = replace_decimals(obj[i])
        return obj
    elif isinstance(obj, dict):
        for k, v in obj.items():
            obj[k] = replace_decimals(v)
        return obj
    elif isinstance(obj, set):
        return set(replace_decimals(i) for i in obj)
    elif isinstance(obj, decimal.Decimal):
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    else:
        return obj

def get_scoreboard(username):
  try:
    response = scoreboard_table.get_item(Key={'username': username})
  except ClientError as e:
    print(e.response['Error']['Message'])
  else:
    print('get_scoreboard Dynamodb response:')
    print(response)
    if 'Item' in response:
      return replace_decimals(response['Item']['results'])


def save_scoreboard(username, scoreboard):
  try:
    response = scoreboard_table.put_item(
       Item={
            'username': username,
            'results': scoreboard
        }
    )
  except ClientError as e:
    print(e.response['Error']['Message'])
  else:
    print('save_scoreboard Dynamodb response:')
    print(response) 


def get_challenge(id):
  try:
    response = challenges_table.get_item(Key={'id': id})
  except ClientError as e:
    print(e.response['Error']['Message'])
  else:
    print('get_challenge Dynamodb response:')
    print(response)
    if 'Item' in response:
      return replace_decimals(response['Item']) 

def delete_challenge(id):
  try:
    response = challenges_table.delete_item(Key={'id': id})
  except ClientError as e:
    print(e.response['Error']['Message'])
  else:
    print('delete_challenge Dynamodb response:')
    print(response)

def select_from_scoreboard(scoreboard):
  s = [k for k in range(2,11) if not (str(k) in scoreboard)]
  if len(s) > 0:
      m = random.choice(s) 
  else:
      s = [[k, scoreboard[k]['duration'], scoreboard[k]['errors']] for k in scoreboard]
      s = [int(v[0]) for v in sorted(s, key=lambda item: item[1] + item[2]*20)]
      m = random.choice(s[-4:])
  return m

def create_challenge(multiply):
  challenge = random.sample(list(range(1,11)),10)
  results = [multiply * k for k in challenge]
  return challenge, results

def save_challenge(username, results, multiply):
  id = str(uuid.uuid4()) 
  startTime = int(time.time())
  
  try:
    response = challenges_table.put_item(
       Item={
            'id': id,
            'username': username,
            'results': results,
            'multiply': multiply,
            'startTime': startTime
        }
    )
  except ClientError as e:
    print(e.response['Error']['Message'])
  else:
    print('save_challenge Dynamodb response:')
    print(response)

  return id
  
def check_challenge_result(username, result):
  finishTime = int(time.time())
  challenge = get_challenge(result['id'])
  
  if challenge:
    if username == challenge['username']:
      if len(result['results']) == len(challenge['results']):
        errors = 0
        for i in range(len(result['results'])):
          if result['results'][i] != challenge['results'][i]:
            errors = errors + 1
        duration = finishTime - challenge['startTime']
        delete_challenge(result['id'])
        return {'multiply' : challenge['multiply'], 'errors' : errors, 'duration': duration, 'when': finishTime}
  
def handler(event, context):
  print('Received event:')
  print(event)

  if all(k in event for k in ('typeName', 'fieldName', 'identity', 'arguments')):
    if 'username' in event['identity']:

      scoreboard = get_scoreboard(event['identity']['username'])
      if scoreboard:
        print('Scoreboard:')
        print(scoreboard)
      else:
        scoreboard = {}

      if (event['typeName'] == 'Query') and (event['fieldName'] == 'getChallenge'): 
        challenge = {}

        multiply = select_from_scoreboard(scoreboard)
        challenge = { 'multiply': multiply }

        challenge['challenge'], results = create_challenge(multiply)
        challenge['id'] = save_challenge(event['identity']['username'], results, multiply)

        print('Challenge:')     
        print(challenge)
        return challenge

      if (event['typeName'] == 'Mutation') and (event['fieldName'] == 'sendChallengeResults'): 

        print('Challenge results:')     
        print(event['arguments'])
        response = check_challenge_result(event['identity']['username'], event['arguments'])

        print('Challenge response:')     
        print(response)

        isPb = False
        m = str(response['multiply'])
        if m in scoreboard:
          if scoreboard[m]['errors'] > response['errors']:
            isPb = True
          elif ((scoreboard[m]['errors'] == response['errors']) and (scoreboard[m]['duration'] > response['duration'])):
            isPb = True 
        else:
          isPb = True

        if isPb:
          scoreboard[m] = {
            'duration': response['duration'],
            'errors': response['errors'],
            'when': response['when']
          }
          print('New scoreboard:')
          print(scoreboard)
          save_scoreboard(event['identity']['username'],scoreboard)

        response['pb'] = isPb

        return response