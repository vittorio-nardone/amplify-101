import boto3
from botocore.exceptions import ClientError
import os
import json
import time

dynamodb = boto3.resource('dynamodb')
scoreboard = dynamodb.Table(os.environ['STORAGE_SCOREBOARD_NAME'])
challenges = dynamodb.Table(os.environ['STORAGE_CHALLENGES_NAME'])

def get_scoreboard(username):
  try:
    response = scoreboard.get_item(Key={'username': username})
  except ClientError as e:
    print(e.response['Error']['Message'])
  else:
    print('Dynamodb response:')
    print(response)
    if 'Item' in response:
      return json.loads(response['Item']['results'])
    
def select_from_scoreboard(scoreboard):
  #TODO
  return 5

def create_challenge(multiply):
  #TODO
  return {'multiply' : 5, 'challenge': [5,2,3]}, {'multiply' : 5, 'result': [25,10,15]}

def save_challenge(username, result):
  #TODO
  id = '1234-568' #unique, to be generated
  startTime = int(time.time())
  #save to db
  return id
  

def handler(event, context):
  print('Received event:')
  print(event)

  challenge = {}

  if 'identity' in event:
    if 'username' in event['identity']:
      scoreboard = get_scoreboard(event['identity']['username'])
      if scoreboard:
        print('Scoreboard:')
        print(scoreboard)

        multiply = select_from_scoreboard(scoreboard)
        challenge, result = create_challenge(multiply)
        challenge['id'] = save_challenge(event['identity']['username'], result)

  print('Challenge:')     
  print(challenge)
  return challenge
