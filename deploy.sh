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

branchname="${1}"

if [ -z "${branchname}" ]; then
  branchname="master"
fi

REMOTE_URL=$(git config --get remote.origin.url)

read -s -p "Password for ${IP_ADDR}: " ssh_password
echo ""

sshpass -p ${ssh_password} ssh -4 -tt ${IP_ADDR} "
  if [ ! -d ${DEPLOY_FOLDER} ]; then
    echo ${ssh_password} | sudo -S mkdir -p ${DEPLOY_FOLDER}
    echo ${ssh_password} | sudo -S sudo chmod 777 ${DEPLOY_FOLDER}
  fi
  cd ${DEPLOY_FOLDER}
  if [ ! -d ProAvalon ]; then
    git clone $REMOTE_URL
  fi
  cd ProAvalon
  git fetch
  git reset --hard origin/master
  git checkout ${branchname}
  git reset --hard origin/${branchname}
  sed -i 's/WorkingDirectory=.../WorkingDirectory=${DEPLOY_FOLDER//\//\\\/}\/ProAvalon/g' proavalon.service
  if [ ! -f /lib/systemd/system/proavalon.service ] || ! cmp -s proavalon.service /lib/systemd/system/proavalon.service; then
    echo ${ssh_password} | sudo cp ./proavalon.service /lib/systemd/system/
  fi

  npm install
  npm install --save-dev jquery@latest
  npm install --save-dev react@latest
  npm install --save-dev react-dom@latest
"

sshpass -p ${ssh_password} scp zzhidden/.env.cus  ${IP_ADDR}:${DEPLOY_FOLDER}/ProAvalon/.env
