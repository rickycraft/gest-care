#!/bin/bash

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# Builds the image
docker build -t gest-care:latest . && \
  echo "Image built" && \
  docker container stop gest-care && \
  echo "Container stopped" && \
  docker run -p 80:80 --rm -d --name gest-care gest-care && \
  echo "Container started"