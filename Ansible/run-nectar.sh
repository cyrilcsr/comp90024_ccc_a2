#!/bin/bash
export ANSIBLE_HOST_KEY_CHECKING=False
. unimelb-comp90024-2021-grp-41-openrc.sh
./unimelb-comp90024-2021-grp-41-openrc.sh; ansible-playbook mrc.yaml --private-key config/general.pem