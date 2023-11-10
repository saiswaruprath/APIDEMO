import json
import boto3
client = boto3.client('s3')

def lambda_handler(event, context):
    response = client.get_object(
        Bucket='bstatus456',
        Key='accountStatus.json',
)
  #convert from streaming data to byte
    data_byte = response['Body'].read()
  # convert from bytes to strings
    data_string = data_byte.decode("UTF-8")
   # convert from json string to dictionary
    data_dict = json.loads(data_string)

    return {
         'statusCode': 200,
         'body': json.dumps(data_dict),
         'headers': {'Content-Type': 'application/json'},
    }