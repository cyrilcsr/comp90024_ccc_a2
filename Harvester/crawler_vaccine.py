import tweepy
import json
import couchdb
import time
import datetime

def read_score():
    with open("AFINN.txt") as f:
        lines = f.readlines()
        afinn = {}
        for line in lines:
            line = line.strip().lower()
            line_len = len(line)
            try:
                score = int(line[line_len - 2: line_len].lstrip())
                word = line[0:line_len - 2].rstrip()
                afinn[word] = score*abs(score)
            except ValueError:
                print("invalid score")
            f.close()
    return afinn


month_list = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
city_list = ["Melbourne", "Brisbane", "Sydney", "Adelaide", "Canberra", "Perth (WA)", "Hobart", "Queensland"]
afinn = read_score()
#couch = couchdb.Server('https://admin:couchdb@172.26.133.237:5984/')
#db = couch.create('test')

consumer_key = "XpmOQhP5fGxWyU9Uq59S6bdP4"
consumer_secret = "sjBYi7vclUV0Y0pOntQk0j3E8dfpnOOluPGgzhABJdoVJFr3ih"
access_token = "731324748114714624-u9YvvC6g3MWxdzcSaot3vdClNyzx5Sg"
access_token_secret = "USHFqYOGehMVAPljy8iGikWsvhmHx9hFQeCIqwdMqkYYy"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)


places = api.geo_search(query="AUS",granularity="country")
place_id = places[0].id

count = 0
while True:

    wfile = open("record_v.json", 'a', encoding="utf-8")
    try:
        idfile = open("id_v.txt",'r')
    except FileNotFoundError:
        f = open("id_v.txt", "w")
        f.close()
        idfile = open("id_v.txt",'r')
    id_list = idfile.readline().split(",")
    new_file = False
    try:
        if id_list[0] == "" and len(id_list) == 1:
            new_file = True
            search_results = api.search(q="vaccine place:%s" % place_id, count=100,
                                        tweet_mode="extended")
        else:
            oldest_id = min(id_list)
            search_results = api.search(q="vaccine place:%s" % place_id,count=100,
                                        tweet_mode="extended",max_id=int(oldest_id)-1)
    except:
        print("rate limiting...15 min,current time:",datetime.datetime.now())
        time.sleep(60 * 15)
        print("waking up,current time:",datetime.datetime.now())
        continue
    idfile.close()
    idfile = open("id_v.txt","a")

    if len(search_results) == 0:
        break
    for tweet in search_results:
        data = tweet._json
        data_dict = {"id": data["id"]}
        if new_file:
            idfile.write(str(data_dict["id"]))
            new_file = False
        else:
            idfile.write(","+str(data_dict["id"]))

        date = data["created_at"].split()
        m = month_list.index(date[1])
        month = "0"+str(m) if m<10 else str(m)
        d = int(date[2])
        day = "0"+str(d) if d<10 else str(d)
        year = date[-1]
        timestamp = year+"/"+month+"/"+day
        data_dict["created_at"] = timestamp

        if data["place"] is not None:
            try:
                city = data["place"]["name"]
                if city in city_list:
                    data_dict["metropolitan"] = True
                else:
                    data_dict["metropolitan"] = False
                data_dict["city"] = city
            except KeyError:
                data_dict["city"] = None
            try:
                coordinates = data["place"]["bounding_box"]["coordinates"][0]
                data_dict["coordinates"] = [(coordinates[0][0] + coordinates[1][0]) / 2.0,
                                            (coordinates[0][1] + coordinates[2][1]) / 2.0]
            except KeyError:
                data_dict["coordinates"] = None

        try:
            try:
                data_dict["text"] = tweet.retweeted_status.full_text
            except AttributeError:  # Not a Retweet
                data_dict["text"] = tweet.full_text
        except KeyError:
            data_dict["text"] = ""

        twitter_text = data_dict["text"].lower()
        replaced_twitter_text = twitter_text.replace('!', ' ').replace(',', ' ') \
            .replace('?', ' ').replace('.', ' ').replace('\\\'', ' ').replace('\\\"', ' ') \
            .replace('\'', ' ').replace('\"', ' ').replace('\\n', ' ')
        split_words = replaced_twitter_text.split()
        totalScore = 0
        for word in split_words:
            score = afinn.get(word, 0)
            totalScore += score
        data_dict["sentiment_score"] = totalScore

        vaccine_list = [["astrazeneca","oxford"],["biontech","fosun","pfizer"],["moderna"],["johnson"],
                        ["chinese","sinovac"],["sputnik"]]
        brand = ""
        for type in vaccine_list:
            for vac in type:
                if vac in twitter_text:
                    brand = vac
                    break
            if brand != "":
                break
        data_dict["vaccine_brand"] = brand
        #db.save(data_dict)
        json_object = json.dumps(data_dict)
        wfile.write(str(json_object)+"\n")
    idfile.close()
    wfile.close()


