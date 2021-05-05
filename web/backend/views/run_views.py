import json

from couchdb.client import Server

server = Server('http://admin:couchdb@172.26.133.237:5984')
db = server['twitter_data']

with open('./mapviews.json', 'r') as f:
    db.save(json.load(f))