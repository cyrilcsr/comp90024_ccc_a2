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

@app.route('/num_tweet/')
def num_tweet():
    param = request.args.get('city')
    data = {}
    num_of_tweet = 0
    pos_tweet = 0
    neg_tweet = 0
    neutral_tweet = 0

    if(param == 'rural'):
        for row in list(db.view('mapviews/rural_count', group=True)):
            if(row.key > 0): pos_tweet += row.value
            elif(row.key < 0): neg_tweet += row.value
            else: neutral_tweet += row.value
    else:
        for row in list(db.view('mapviews/sentiment_distribution', group=True)):
            if(param == 'total'):
                if(row.key[1] > 0): pos_tweet += row.value
                elif(row.key[1] < 0): neg_tweet += row.value
                elif(row.key[1] == 0): neutral_tweet += row.value
            elif(param == row.key[0]):
                if(row.key[1] > 0): pos_tweet += row.value
                elif(row.key[1] < 0): neg_tweet += row.value
                elif(row.key[1] == 0): neutral_tweet += row.value

    num_of_tweet = pos_tweet + neg_tweet + neutral_tweet  
    response = {
        "code": 200, 
        "msg": 'success',
        "data": {
            "city": param,
            "neg_tweet": neg_tweet,
            "pos_tweet": pos_tweet,
            "neutral_tweet": neutral_tweet,
            "total_tweet": num_of_tweet
        }
        
    }
    
    return jsonify(response)

@app.route('/sentiment_score/')
def sentiment_score():
    city_name = request.args.get('city')
    sentiment_score = 0
    data = {}

    for row in list(db.view('mapviews/city_total_sentiment_score', group=True)):
        if city_name == row.key:
            sentiment_score = row.value
        elif city_name == 'rural' and is_rural(row.key[0]):
            sentiment_score += row.value
        elif city_name == 'total':
            data[row.key] = row.value
            sentiment_score += row.value

    reponse = {
        "code": 200,
        "msg": 'success',
        "city": city_name,
        "sentiment_score": sentiment_score,
        "data": data
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

@app.route('/vaccine_brand')
def vaccine_brand():
    brands = []
    counts = {}
    for row in list(db.view('mapviews/brand_count', group=True)):
        brands.append(row.key)
        counts[row.key] = row.value
    
    response = {
        "code": 200,
        "msg": 'success',
        "vaccine_brand": brands,
        "counts": counts
    }

    return jsonify(response)

@app.route('/city_data')
def city_data():
    cities = ['Overall', 'Rural, Area']
    counts = {'Overall': 0, 'Rural Area': 0}
    total_score = 0

    for row in list(db.view('mapviews/city_count', group=True)):
        total_score += row.value
        if(is_rural(row.key)):
            counts['Rural Area'] += row.value
        else:
            cities.append(row.key)
            counts[row.key] = row.value
    counts['Overall'] = total_score
    response = {
        "code": 200,
        "msg": 'success',
        "city": cities,
        "counts": counts
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)

