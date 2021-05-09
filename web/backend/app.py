from couchdb.client import Server
from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
server = Server('http://admin:couchdb@172.26.133.237:5984')
db = server['twitter_data']

def is_rural(city_name):
    return city_name not in ['Adelaide', 'Melbourne', 'Brisbane', 'Canberra', 'Perth', 'Sydney']


@app.route('/num_tweet/', methods=['GET'])
def num_tweet():
    param = request.args.get('option')
    data = {}

    for row in list(db.view('mapviews/sentiment_distribution', group=True)):

        if(param == 'total' or (param == 'rural' and is_rural(row.key[0]))): key = param
        elif(param == row.key[0] or (param == 'city' and not is_rural(row.key[0]))): key = row.key[0]
        elif(param == 'rural' or param == 'city'): continue

        if key not in data:
            data[key] = {'total_tweet': 0, 'pos_tweet': 0, 'neg_tweet': 0, 'neutral_tweet': 0}

        data[key]['total_tweet'] += row.value
        if(row.key[1] > 0): data[key]['pos_tweet'] += row.value
        elif(row.key[1] < 0): data[key]['neg_tweet'] += row.value
        elif(row.key[1] == 0):  data[key]['neutral_tweet'] += row.value
    
    response = {
        "code": 200, 
        "msg": 'success',
        "data": data
    }
    
    return jsonify(response)


@app.route('/sentiment_score/')
def sentiment_score():
    param = request.args.get('city')
    sentiment_score = 0
    data = {}

    for row in list(db.view('mapviews/city_total_sentiment_score', group=True)):

        if param == row.key or (param == 'rural' and is_rural(row.key[0])):
            data[param]['sentiment_score'] += row.value

        elif param == 'total':
            if (is_rural(row.key)): key = 'rural'
            else: key = row.key

            if key not in data:
                data[key] = {'sentiment_score': 0}
            data[key]['sentiment_score'] += row.value

    reponse = {
        "code": 200,
        "msg": 'success',
        "data": data
    }

    return jsonify(reponse)

@app.route('/sentiment_distribution/')
def sentiment_distribution():
    param = request.args.get('city')
    result_dict= {}
    data = {}

    for row in list(db.view('mapviews/sentiment_distribution', group=True)):
        if(param =='total' or (param == 'rural' and is_rural(row.key[0])) or row.key[0] == param):
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
    app.run(debug=False)

