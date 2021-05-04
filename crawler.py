import tweepy
import json

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


afinn = read_score()
wfile = open("record.txt",'w',encoding="utf-8")

consumer_key = "XpmOQhP5fGxWyU9Uq59S6bdP4"
consumer_secret = "sjBYi7vclUV0Y0pOntQk0j3E8dfpnOOluPGgzhABJdoVJFr3ih"
access_token = "731324748114714624-u9YvvC6g3MWxdzcSaot3vdClNyzx5Sg"
access_token_secret = "USHFqYOGehMVAPljy8iGikWsvhmHx9hFQeCIqwdMqkYYy"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

places = api.geo_search(query="AUS",granularity="country")
place_id = places[0].id

search_results = api.search(q="vaccine place:%s" % place_id,count=20)


for tweet in search_results:
    data = tweet._json
    data_dict = {"created_at": data["created_at"], "id": data["id"],
                 "coordinates": data["place"]["bounding_box"]["coordinates"],
                 "city": data["place"]["name"]}

    city_list = ["Melbourne", "Brisbane", "Sydney", "Adelaide", "Canberra", "Perth", "Hobart"]
    if data_dict["city"] in city_list:
        data_dict["metropolitan"] = True
    else:
        data_dict["metropolitan"] = False

    try:
        tid = data["id"]
        status = api.get_status(tid, tweet_mode="extended")
        try:
            data_dict["text"] = status.retweeted_status.full_text
        except AttributeError:  # Not a Retweet
            data_dict["text"] = status.full_text
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

    vaccine_list = [["astrazeneca","oxford"],["biobtech","fosun","pfizer"],["moderna"],["johnson"],
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
    json_object = json.dumps(data_dict)
    wfile.write(str(json_object)+"\n")