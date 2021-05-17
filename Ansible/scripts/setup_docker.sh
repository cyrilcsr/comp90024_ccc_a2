sudo systemctl start docker
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo echo "[Service]" >> /etc/systemd/system/docker.service.d/http-proxy.conf
sudo echo "Environment=\"HTTP_PROXY=http://wwwproxy.unimelb.edu.au:8000\"" >> /etc/systemd/system/docker.service.d/http-proxy.conf
sudo echo "Environment=\"HTTPS_PROXY=http://wwwproxy.unimelb.edu.au:8000\"" >> /etc/systemd/system/docker.service.d/http-proxy.conf
sudo echo "Environment=\"http_proxy=http://wwwproxy.unimelb.edu.au:8000\"" >> /etc/systemd/system/docker.service.d/http-proxy.conf
sudo echo "Environment=\"https_proxy=http://wwwproxy.unimelb.edu.au:8000\"" >> /etc/systemd/system/docker.service.d/http-proxy.conf
sudo echo "Environment=\"no_proxy=localhost,127.0.0.1,localaddress,172.16.0.0/12,.melbourne.rc.nectar.org.au,.storage.unimelb.edu.au,.cloud.unimelb.edu.au\"" >> /etc/systemd/system/docker.service.d/http-proxy.conf

sudo systemctl daemon-reload
sudo systemctl restart docker

sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

docker pull couchdb:latest