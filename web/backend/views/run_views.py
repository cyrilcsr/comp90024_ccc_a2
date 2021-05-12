from couchdb.client import Server
import json

server = Server('http://admin:couchdb@172.26.128.245:5984')
vaccine = server['twitter_data']

with open('./mapviews.json', 'r') as f:
    vaccine.save(json.load(f))