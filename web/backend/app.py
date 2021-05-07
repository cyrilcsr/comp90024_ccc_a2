from couchdb.client import Server
from flask import Flask
from flask import jsonify
from flask import request
from bs4 import BeautifulSoup



app = Flask(__name__)
server = Server('http://admin:couchdb@172.26.133.237:5984')
db = server['twitter_data']

def is_rural(city_name):
    return city_name not in ['Adelaide', 'Melbourne', 'Brisbane', 'Canberra', 'Perth', 'Sydney']

@app.route('/sentiment_score/')
def sentiment_score():
    city_name = request.args.get('city')
    sentiment_score = 0

    for row in list(db.view('mapviews/city_total_sentiment_score', group=True)):
        if city_name == row.key:
            sentiment_score = row.value
        elif city_name == 'rural' and is_rural(row.key[0]):
            sentiment_score += row.value
        elif city_name == 'total':
            sentiment_score += row.value

    reponse = {
        "code": 200,
        "msg": 'success',
        "city": city_name,
        "sentiment_score": sentiment_score
    }

    return jsonify(reponse)

@app.route('/sentiment_distribution/')
def sentiment_distribution():
    city_name = request.args.get('city')
    result_dict= {}
    data = {}

    for row in list(db.view('mapviews/sentiment_distribution', group=True)):
        if(city_name =='total'):
            sentiment_score = str(row.key[1])
            result_dict[sentiment_score] = row.value
        elif(city_name == 'rural'):
            if(is_rural(row.key[0])):
                sentiment_score = str(row.key[1])
                result_dict[sentiment_score] = row.value  
        elif(row.key[0] == city_name):
            sentiment_score = str(row.key[1])
            result_dict[sentiment_score] = row.value

    data['city'] = city_name        
    data['sentiment_count'] = result_dict

    response = {
        "code": 200,
        "msg": 'success',
        "data": data
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)

