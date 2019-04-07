#!/bin/bash
ENV_FILE=/opt/onit/workdir/env
IMAGE=onit-api-image

echo "Stopping $IMAGE if running..."
docker stop $IMAGE || true

# cleanup
echo "Removing existing container $IMAGE if present..."
docker rm $IMAGE || true

# run your container
echo "Loading the new image $IMAGE..."
source $ENV_FILE
docker load < /opt/onit/workdir/$IMAGE.tar.gz
docker run --name $IMAGE -p 80:3000 --link some-mongo --restart always \
    -e DB_URL=$DB_URL \
    -e SECRET=$SECRET \
    -e WATSON_ASSISTANT_ID=$WATSON_ASSISTANT_ID \
    -e WATSON_USER=$WATSON_USER \
    -e WATSON_PWD=$WATSON_PWD \
    -d $IMAGE
rm $ENV_FILE