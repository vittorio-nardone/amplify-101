import boto3
from botocore.exceptions import ClientError
import os
import json
import decimal

dynamodb = boto3.resource('dynamodb')
scoreboard = dynamodb.Table(os.environ['STORAGE_SCOREBOARD_NAME'])

def reset_scoreboard(username):
  try:
    response = scoreboard.delete_item(Key={'username': username})
  except ClientError as e:
    print(e.response['Error']['Message'])
  else:
    print('Dynamodb response:')
    print(response)

def get_scoreboard(username):
  try:
    response = scoreboard.get_item(Key={'username': username})
  except ClientError as e:
    print(e.response['Error']['Message'])
  else:
    print('Dynamodb response:')
    print(response)
    if 'Item' in response:
      return replace_decimals(response['Item']['results'])
    
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

def handler(event, context):
  print('Received event:')
  print(event)

  if all(k in event for k in ('typeName', 'fieldName', 'identity')):

    if (event['typeName'] == 'Query') and (event['fieldName'] == 'getScores'): 

      results = []

      if 'username' in event['identity']:
        scoreboard = get_scoreboard(event['identity']['username'])
        if scoreboard:
          print('Scoreboard:')
          print(scoreboard)
          for m in sorted(scoreboard.keys(), key=lambda item: int(item)):
            record = {
                'multiply': m, 
                'duration': scoreboard[m]['duration'],
                'errors': scoreboard[m]['errors'],
                'when': scoreboard[m]['when']
            }
            results.append(record)

      print(results)
      return results

    if (event['typeName'] == 'Mutation') and (event['fieldName'] == 'resetScores'): 
      
      if 'username' in event['identity']:
        reset_scoreboard(event['identity']['username'])
        
      return []


