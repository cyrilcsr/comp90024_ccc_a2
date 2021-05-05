from couchdb.client import Server
from flask import Flask
from flask import jsonify


app = Flask(__name__)
server = Server('http://172.26.133.237:5984')
db = server['twitter_data']



