echo "HTTP_PROXY=http://wwwproxy.unimelb.edu.au:8000/" >> /etc/environment
echo "HTTPS_PROXY=http://wwwproxy.unimelb.edu.au:8000/" >> /etc/environment
echo "http_proxy=http://wwwproxy.unimelb.edu.au:8000/" >> /etc/environment
echo "https_proxy=http://wwwproxy.unimelb.edu.au:8000/" >> /etc/environment
echo "https_proxy=no_proxy=localhost,127.0.0.1,localaddress,172.16.0.0/12,.melbourne.rc.nectar.org.au,.storage.unimelb.edu.au,.cloud.unimelb.edu.au" >> /etc/environment

