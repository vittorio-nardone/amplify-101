import boto3
from botocore.exceptions import ClientError
import os
import json

dynamodb = boto3.resource('dynamodb')
scoreboard = dynamodb.Table(os.environ['STORAGE_SCOREBOARD_NAME'])


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
    

def handler(event, context):
  print('Received event:')
  print(event)

  results = []

  if 'identity' in event:
    if 'username' in event['identity']:
      scoreboard = get_scoreboard(event['identity']['username'])
      if scoreboard:
        print('Scoreboard:')
        print(scoreboard)
        for m in scoreboard.keys():
          record = {
              'multiply': m, 
              'duration': scoreboard[m]['duration'],
              'errors': scoreboard[m]['errors'],
              'when': scoreboard[m]['when']
          }
          results.append(record)

  print(results)
  return results
