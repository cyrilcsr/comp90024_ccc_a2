from couchdb.client import Server
import json

server1 = Server('http://admin:couchdb@172.26.133.237:5984')
server2 = Server('http://admin:couchdb@172.26.128.245:5984')
branddb = server1['twitter_data']
parties = server1['parties_data']
vaccine = server2['twitter_data']

with open('./vaccine.json', 'r') as f:
    vaccine.save(json.load(f))
    f.close()
with open('./brand_view.json') as f:
    branddb.save(json.load(f))
    f.close()
with open('./parties_views.json') as f:
    parties.save(json.load(f))
    f.close()