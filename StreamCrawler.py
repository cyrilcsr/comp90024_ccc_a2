from tweepy import OAuthHandler, Stream, StreamListener
import twitterCredential, time
from urllib3.exceptions import ProtocolError
from http.client import IncompleteRead as http_incompleteRead
from urllib3.exceptions import IncompleteRead as urllib3_incompleteRead


class StdOutListener(StreamListener):
    """ A listener handles tweets that are received from the stream.
    This is a basic listener that just prints received tweets to stdout.
    """

    def on_data(self, data):
        print(data)
        try:
            print(data)
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
            stream.filter(track=['AUS', 'vaccine'])
        except (ProtocolError, AttributeError):
            continue

