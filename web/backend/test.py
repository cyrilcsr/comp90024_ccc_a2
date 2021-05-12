from couchdb.client import Server
import json

print('starting')
server = Server('http://admin:couchdb@172.26.128.245:5984')
print('connected')
db = server['twitter_data']

with open('../../../../../record(1).json') as jsonfile:
    for row in jsonfile:
        data = json.loads(row)
        db.save(data)