from tweepy import OAuthHandler, Stream, StreamListener
import twitterCredential, time, json, couchdb
from urllib3.exceptions import ProtocolError
from http.client import IncompleteRead as http_incompleteRead
from urllib3.exceptions import IncompleteRead as urllib3_incompleteRead

month_list = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
city_list = ["Melbourne", "Brisbane", "Sydney", "Adelaide", "Canberra", "Perth (WA)", "Hobart", "Queensland"]

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

def processData(data):
    data = json.loads(data)
    data_dict = {"id": data["id"]}

    date = data["created_at"].split()
    m = month_list.index(date[1])
    month = "0" + str(m) if m < 10 else str(m)
    d = int(date[2])
    day = "0" + str(d) if d < 10 else str(d)
    year = date[-1]
    timestamp = year + "/" + month + "/" + day
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

    """clean data to calculate sentiment score"""
    rawText = data["text"]
    data_dict["text"] = rawText
    # data_dict["text"] = re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", "", rawText)
    # print(data_dict["text"])
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

    vaccine_list = [["astrazeneca", "oxford"], ["biontech", "fosun", "pfizer"], ["moderna"], ["johnson"],
                    ["chinese", "sinovac"], ["sputnik"]]
    brand = ""
    for type in vaccine_list:
        for vac in type:
            if vac in twitter_text:
                brand = vac
                break
        if brand != "":
            break

    data_dict["vaccine_brand"] = brand
    return data_dict

class StdOutListener(StreamListener):
    """ A listener handles tweets that are received from the stream.
    This is a basic listener that just prints received tweets to stdout.
    """

    def on_data(self, data):
        try:
            processedData = processData(data)
            if processedData["vaccine_brand"] != "":
                print("get one tweet")
                couch = couchdb.Server("http://admin:couchdb@localhost:5984")
                db = couch['brand']
                if str(processedData["id"]) not in db:
                	db[str(processedData["id"])] = processedData

        except http_incompleteRead as e:
            print("http incompleteRead error: %s" % str(e))
            print("Restart in 10 seconds")
            time.sleep(10)
            return True
        except urllib3_incompleteRead as e:
            print("urllib3 IncompleteRead error: %s" % str(e))
            print("Restart in 10 seconds")
            time.sleep(10)
            return True
        except BaseException as e:
            print("Error: %s" % str(e))
            print("Restart in 10 seconds")
            time.sleep(10)
            return True
        return True

    def on_error(self, status):
        if status == 420:
            # return false in on_data disconnects the stream
            return False
        print(status)



if __name__ == '__main__':
    listener = StdOutListener()
    auth = OAuthHandler(twitterCredential.consumer_key, twitterCredential.consumer_secret)
    auth.set_access_token(twitterCredential.access_token, twitterCredential.access_token_secret)

    stream = Stream(auth, listener)

    # filter stream data by the keywords:
    while True:
        try:
            #stream api filter not allow to filter by location and keyword at the same time
            stream.filter(locations=[113.338953078, -43.6345972634, 153.569469029, -10.6681857235])
        except (ProtocolError, AttributeError):
            continue

