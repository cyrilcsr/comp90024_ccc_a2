# comp90024_ccc_a2

Project: COMP90024--2021S1--Assignment2

Title: Do Australians support COVID-19 vaccines?

Team: Group41

Member:

* Huimin Huang 1142020

* Han Sun 1111271

* Jean Ma 1028582

* Shirui Cheng 1189721

* Xiaoyue Lyu 1237539

## Installation
```javascript
sudo pip install ansible
```

## Steps of Deployment
Download OpenStack RC file from MRC project page under USER tab
https://dashboard.cloud.unimelb.edu.au/project/

Set project password on the Settings page https://dashboard.cloud.unimelb.edu.au/settings/reset-password/

Put downloaded OpenStack RC file under directory Ansible/.

Put private ssh key under Ansible/config/ directory, in our case the ssh key is general.pem.

CD to directory Ansible/ and run script run-nectar.sh in shell.

```javascript
cd Ansible/
./run-nectar.sh
```

## End User Invocation
Go to MRC project instance page https://dashboard.cloud.unimelb.edu.au/project/instances/.

Then copy the IP address of the instance webserver. Tap copied IP address with port 3000 (E.g. \url{http:// 172.26.130.118:3000}) on the address bar of your browser. You will see the open page, which gives a basic count on the vaccine support rate.
