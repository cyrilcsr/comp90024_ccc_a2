import configparser

# read .ini file to get ips for db
in_file = './instance_ips.ini'
config = configparser.ConfigParser(allow_no_value=True)
config.read(in_file)
(ip1, _),(ip2, _) = config.items('database')

server1_url = 'http://admin:couchdb@' + ip1 + ':5984'
server2_url = 'http://admin:couchdb@' + ip2 + ':5984'
print(server1_url)
