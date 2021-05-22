from flask import Flask
from flask import jsonify
from flask import request
from flask import  send_from_directory
from flask import abort
from couchdb.client import Server
from flask_cors import CORS
import json
import uuid
import fnmatch
import configparser

# read .ini file to get ips for db
IN_FILE = 'config/instance_ips.ini'
config = configparser.ConfigParser(allow_no_value=True)
config.read(IN_FILE)
(ip1, _),(ip2, _),(ip3, _) = config.items('database')
beip, _ = config.items('backend')[0]
db_list = [ip1,ip2,ip3]
db_list.remove(beip)


os.system("curl -X POST -H "+'"Content-Type: application/json"'+
      " http://admin:couchdb@"+beip+":5984/_cluster_setup -d '"+
      '{"action": "enable_cluster", "bind_address":"0.0.0.0", "username": "admin", "password":"couchdb", "node_count":"3"}'+"'")
os.system("curl -X POST -H "+'"Content-Type: application/json"'+
            " http://admin:couchdb@"+beip+":5984/_cluster_setup -d '"+
            '{"action": "enable_cluster", "bind_address":"0.0.0.0", "username": "admin", "password":"couchdb", '
            '"port": 5984, "node_count": "3", "remote_node": "'+db_list[0]+'", "remote_current_user": "admin", "remote_current_password": "couchdb"}'+"'")
os.system("curl -X POST -H "+'"Content-Type: application/json"'+
            " http://admin:couchdb@"+beip+":5984/_cluster_setup -d '"+
            '{"action": "add_node", "host":"'+db_list[0]+'", "port": "5984", "username": "admin", "password":"couchdb"}'+"'")
os.system("curl -X POST -H "+'"Content-Type: application/json"'+
            " http://admin:couchdb@"+beip+":5984/_cluster_setup -d '"+
            '{"action": "enable_cluster", "bind_address":"0.0.0.0", "username": "admin", "password":"couchdb", '
            '"port": 5984, "node_count": "3", "remote_node": "'+db_list[1]+'", "remote_current_user": "admin", "remote_current_password": "couchdb" }'+"'")
os.system("curl -X POST -H "+'"Content-Type: application/json"'+
            " http://admin:couchdb@"+beip+":5984/_cluster_setup -d '"+
            '{"action": "add_node", "host":"'+db_list[1]+'", "port": "5984", "username": "admin", "password":"couchdb"}'+"'")
os.system("curl -X POST -H "+'"Content-Type: application/json"'+
            " http://admin:couchdb@"+beip+":5984/_cluster_setup -d '"+'{"action": "finish_cluster"}'+"'")


server1_url = 'http://admin:couchdb@' + ip1 + ':5984'
server2_url = 'http://admin:couchdb@' + ip2 + ':5984'
# server3_url = 'http://admin:couchdb@' + ip3 + ':5984'

server1 = Server(server1_url)
server2 = Server(server2_url)
#server3 = Server(server2_url)


# Upload aurin data to couchdb
if not 'parties_data' in server1:
    db = server1.create('parties_data')
else: db = server1['parties_data']

with open('grouped_election_data.json') as jsonfile:
    data = json.load(jsonfile)
    jsonfile.close()
    result = {}

    feature_list = data['features']

    for row in feature_list:
        data = json.loads(json.dumps(row))
        coordinate = str(data['geometry']['coordinates']) # _id has to be a string
        property_dict = {i:j for i,j in data['properties'].items() if j != None} # take out null
        pattern = '*_percent'
        doc = {}
        for item in property_dict:
            if fnmatch.fnmatch(item, pattern):
                party_name = item.replace('_percent', '')
                doc[party_name] = property_dict[item]
            else: doc[item] = property_dict[item]
        result[coordinate] = doc

    print('start uploading data')
    for d in result:
        if d not in db: db[d] = result[d]

if 'twitter_data' in server1:
    branddb = server1['twitter_data']
else: branddb = server1.create('brand_data')

if 'twitter_data' in server2:
   vaccine = server2['twitter_data']
else: vaccine = server2.create('vaccine_data')

parties = server1['parties_data']

try:

    # apply mapreduce functions to couchdb
    with open('views/vaccine.json', 'r') as f:
        vaccine.save(json.load(f))
        f.close()
    with open('views/brand_view.json', 'r') as f:
        branddb.save(json.load(f))
        f.close()
    with open('views/parties_views.json', 'r') as f:
        parties.save(json.load(f))
        f.close()
except: 
    print('Conflict occured')


app = Flask(__name__)
CORS(app)

def is_rural(city_name):
    return city_name not in ['Adelaide', 'Melbourne', 'Brisbane', 'Canberra', 'Perth', 'Sydney']

def build_dic():
    return {'total_tweet':0, 'pos_tweet':0, 'neg_tweet':0, 'neutral_tweet':0}

def construct_geojson():

    data = {
        "type": "Feature", 
        "properties": { 
            "id": uuid.uuid4(), 
            "mag": 0 
        }, 
        "geometry": { 
            "type": "Point", 
            "coordinates": [] 
        } 
    }
    return data

@app.route('/send_ini/')
def send_ini():
    try:
        send_from_directory(filename='instance_ips.ini')
    except FileNotFoundError:
        abort(404)

@app.route('/num_tweet_city/')
def num_tweet_city():
    param = request.args.get('option')
    data = build_dic()

    for row in list(vaccine.view('mapviews/sentiment_distribution', group=True)):
        if(param == row.key[0]):
            data['total_tweet'] += row.value
            if(row.key[1] > 0): 
                data['pos_tweet'] += row.value
            elif(row.key[1] < 0): 
                data['neg_tweet'] += row.value
            elif(row.key[1] == 0):  
                data['neutral_tweet'] += row.value
        
    response = {
        "code": 200, 
        "msg": 'success',
        'city': param,
        "data": data
    }
    
    return jsonify(response)

@app.route('/vaccine_trend/')
def vaccine_trend():
    location = request.args.get('location')
    data = {}

    for row in list(vaccine.view('mapviews/posneg_vaccine_trend', group=True)):
        
        if(location == 'Overall Tweet' or 
           location == row.key[2] or 
           (location == 'rural' and is_rural(row.key[2]))):

            if row.key[0] not in data: 
                data[row.key[0]] = {'pos': 0, 'neg': 0, 'total': 0}

            if(row.key[1] == 'pos'): 
                data[row.key[0]]['pos'] = row.value
            elif(row.key[1] == 'neg'): 
                data[row.key[0]]['neg'] = row.value

            data[row.key[0]]['total'] = data[row.key[0]]['pos'] + data[row.key[0]]['neg']
    
    return jsonify(data)


@app.route('/brand_trend/')
def brand_trend():
    brand = request.args.get('brand')
    data = {}
    for row in list(branddb.view('mapviews/brand_trend', group=True)):
        if(brand == 'Overall Brands' or brand.lower() == row.key[2]):
            if row.key[0] not in data: 
                data[row.key[0]] = {'pos': 0, 'neg': 0, 'total': 0}

            if(row.key[1] == 'pos'): 
                data[row.key[0]]['pos'] = row.value
            elif(row.key[1] == 'neg'): 
                data[row.key[0]]['neg'] = row.value

            data[row.key[0]]['total'] = data[row.key[0]]['pos'] + data[row.key[0]]['neg']
    
    return jsonify(data)

@app.route('/total_num_tweet/')
def total_num_tweet():
    param = request.args.get('option')
    data = {}
    data['total'] = build_dic()

    for row in list(vaccine.view('mapviews/sentiment_distribution', group=True)):
        if(is_rural(row.key[0])): key = 'RuralArea'
        elif(param == 'sum'): key = 'city'
        else: key = row.key[0]
        
        if key not in data: data[key] = build_dic()
        
        data[key]['total_tweet'] += row.value
        data['total']['total_tweet'] += row.value

        if(row.key[1] > 0): 
            data[key]['pos_tweet'] += row.value
            data['total']['pos_tweet'] += row.value
        elif(row.key[1] < 0):
            data['total']['neg_tweet'] += row.value
            data[key]['neg_tweet'] += row.value
        elif(row.key[1] == 0):  
            data[key]['neutral_tweet'] += row.value
            data['total']['neutral_tweet'] += row.value

    return jsonify(data)

@app.route('/positive_per_city/')
def positive_per_city():
    data = {'positive': 0, 'others': 0}
    city = request.args.get('city')
    for row in list(vaccine.view('mapviews/positive_score', group=True)):
        if((city == 'RuralArea' and is_rural(row.key)) 
            or city == row.key 
            or city == 'Overall Tweet'):
            data['positive'] += row.value
    for row in list(vaccine.view('mapviews/other_score', group=True)):
        if((city == 'RuralArea' and is_rural(row.key)) 
            or city == row.key 
            or city == 'Overall Tweet'):
            data['others'] += row.value
     
    return jsonify(data)

@app.route('/positive_score/')
def positive_score():
    data = {}
    data['total'] = {'positive': 0, 'others': 0}
    total_count = 0
    for row in list(vaccine.view('mapviews/positive_score', group=True)):
        if(is_rural(row.key)): 
            key = 'RuralArea'
        else: 
            key = row.key

        if key not in data: 
            data[key] = {'positive': 0, 'others': 0}

        total_count += row.value
        data[key]['positive'] += row.value
    data['total']['positive'] = total_count

    for row in list(vaccine.view('mapviews/other_score', group=True)):
        if(is_rural(row.key)): 
            key = 'RuralArea'
        else: 
            key = row.key
        if key not in data: 
            data[key] = {'positive': 0, 'others': 0}
        total_count += row.value
        data[key]['others'] += row.value

    data['total']['others'] = total_count

    response = {
        'code': 200,
        'msg': 'success',
        'data': data
    }

    return jsonify(response)


@app.route('/sentiment_score/')
def sentiment_score():
    param = request.args.get('city')
    data = {}

    for row in list(vaccine.view('mapviews/city_total_sentiment_score', group=True)):

        if param == row.key or (param == 'rural' and is_rural(row.key[0])):
            data[param]['sentiment_score'] += row.value

        elif param == 'total':
            if (is_rural(row.key)): 
                key = 'rural'
            else: 
                key = row.key

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

    for row in list(vaccine.view('mapviews/sentiment_distribution', group=True)):
        if(param =='total' or 
        (param == 'rural' and is_rural(row.key[0])) or 
        row.key[0] == param):
            sentiment_score = str(row.key[1])
            result_dict[sentiment_score] = row.value

    data['city'] = param        
    data['sentiment_count'] = result_dict

    response = {
        "code": 200,
        "msg": 'success',
        "data": data
    }

    return jsonify(response)

@app.route('/vaccine_brand')
def vaccine_brand():
    brands = ["Overall Brands"]
    counts = {"Overall Brands": 0}

    for row in list(branddb.view('mapviews/brand_count', group=True)):
        brands.append(str.capitalize(row.key))
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
    cities = ['Overall Tweet', 'Rural Area']
    counts = {'Overall Tweet': 0, 'Rural Area': 0}
    total_score = 0

    for row in list(vaccine.view('mapviews/city_count', group=True)):
        total_score += row.value
        if(is_rural(row.key)):
            counts['Rural Area'] += row.value
        else:
            cities.append(row.key)
            counts[row.key] = row.value

    counts['Overall Tweet'] = total_score

    response = {
        "code": 200,
        "msg": 'success',
        "city": cities,
        "counts": counts
    }

    return jsonify(response)

@app.route('/brand_stat/')
def brand_stat():
    data = {}

    for row in list(branddb.view('mapviews/brand_view', group=True)):
        if row.key[0] not in data: 
            data[row.key[0]] = []
        pos_tweet, neg_tweet, neutral_tweet, total = 0, 0, 0, 0
        if row.key[2] == 'pos': 
            pos_tweet = row.value
        elif row.key[2] == 'neg': 
            neg_tweet = row.value
        else: 
            neutral_tweet = row.value

        total = pos_tweet + neg_tweet + neutral_tweet

        stat_row = [row.key[1], total, pos_tweet, neg_tweet, neutral_tweet]
        data[row.key[0]].append(stat_row)

    for row in list(branddb.view('mapviews/brand_sentiment', group=True)):
        stats = data[row.key[0]]
        for stat in stats:
            if stat[0] == row.key[1]: stat.append(row.value)
    
    return jsonify({
        'code': 200,
        'structure': ['date', 'total_tweet', 'pos_tweet', 'neg_tweet', 'neutral_tweet', 'sentiment_score'],
        'data': data
    })

@app.route('/political_party/')
def political_party():
    features = []

    param = request.args.get('party')
    views = 'mapviews/data_' + param

    for row in list(parties.view(views)):
        data = construct_geojson()
        arr = row.id[1:-2].split(',')
        coordinates = []
        for k in arr: coordinates.append(float(k))
        coordinates.append(row.value)

        data['geometry']['coordinates'] = coordinates
        data['properties']['mag'] = row.value
        data['properties']['state'] = row.key

        features.append(data)

    response = {
        'type': 'FeatureCollection',
        'features': features
    }

    return jsonify(response)

@app.route('/political_party_per_area/')
def political_party_per_area():
    param = request.args.get('state')
    data = {'state': param, 'the_greens': {}, 'the_nationals': {}, 'australian_labor_party': {}, 'liberal': {}}
    for row in list(parties.view('mapviews/stats_the_greens', group=True)):
        if row.key[0] == param: 
            data['the_greens'][row.key[1]] = row.value
    for row in list(parties.view('mapviews/stats_the_nationals', group=True)):
        if row.key[0] == param: 
            data['the_nationals'][row.key[1]] = row.value
    for row in list(parties.view('mapviews/stats_australian_labor_party', group=True)):
        if row.key[0] == param: 
            data['australian_labor_party'][row.key[1]] = row.value
    for row in list(parties.view('mapviews/stats_liberal', group=True)):
        if row.key[0] == param: 
            data['liberal'][row.key[1]] = row.value
        
    data = {
        'code': 200,
        'msg': 'success',
        'data': data
    }
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
