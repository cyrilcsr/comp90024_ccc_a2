from couchdb.client import Server
import json
import fnmatch

print('starting')
server = Server('http://admin:couchdb@172.26.133.237:5984')
print('connected')

if not 'parties_data' in server:
    db = server.create('parties_data')
else: db = server['parties_data']

with open('../../../../../grouped_election_data(1).json') as jsonfile:
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
        
