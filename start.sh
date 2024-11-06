#!/bin/bash

IMAGE_NAME="kronoos"

if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]]; then
  docker build -t $IMAGE_NAME .
fi

OUTPUT_PATH="$(pwd)/output"
mkdir -p "$OUTPUT_PATH"

docker run -p 3000:3000 --rm -v "$OUTPUT_PATH:/usr/src/app/output" $IMAGE_NAME
