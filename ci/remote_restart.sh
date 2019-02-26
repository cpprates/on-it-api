#!/bin/bash

IMAGE=onit-api-image

echo "Stopping $IMAGE if running..."
docker stop $IMAGE || true

# cleanup
echo "Removing existing container $IMAGE if present..."
docker rm $IMAGE || true

# run your container
echo "Loading the new image $IMAGE..."
docker load < /opt/onit/workdir/$IMAGE.tar.gz
docker run --name $IMAGE -p 80:3000 --restart always -d $IMAGE