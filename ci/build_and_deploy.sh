#!/bin/bash
set -e

USER=ec2-user
HOST=ec2-18-204-24-255.compute-1.amazonaws.com
IMAGE_NAME=onit-api-image
PEM_FILE=./ci/global_key.pem
ENV_FILE=./ci/env

# Install cert
chmod 400 ${PEM_FILE}
ssh-add ${PEM_FILE}

rm ${IMAGE_NAME}.tar.gz || true

echo "Building and deploying $IMAGE_NAME..."
docker build -t ${IMAGE_NAME} .
docker save ${IMAGE_NAME} | gzip > ${IMAGE_NAME}.tar.gz

ssh ${USER}@${HOST} 'mkdir -p /opt/onit/workdir'
scp ${IMAGE_NAME}.tar.gz ${USER}@${HOST}:/opt/onit/workdir
scp ${ENV_FILE} ${USER}@${HOST}:/opt/onit/workdir
ssh ${USER}@${HOST} 'bash -s' < ./ci/remote_restart.sh


