#!/bin/bash

# Note: this is a hack to help with deploying to my local server and shouldn't be commited to any other repo

if [ ! -f "zzhidden/.deployvars.cus" ]; then
  echo "zzhidden/.deployvars.cus does not exist"
  exit 1
fi

source zzhidden/.deployvars.cus

if [ -z "${IP_ADDR}" ]; then
  echo "no ip address"
  exit 1
fi

if [ -z "${DEPLOY_FOLDER}" ]; then
  echo "no deploy folder"
  exit 1
fi

REMOTE_URL=$(git config --get remote.origin.url)

read -s -p "Password for ${IP_ADDR}: " ssh_password
echo ""

sshpass -p ${ssh_password} ssh -4 -tt ${IP_ADDR} "
echo ${ssh_password} | sudo -S systemctl daemon-reload
echo ${ssh_password} | sudo -S systemctl restart proavalon
sleep 2
systemctl status proavalon
"
