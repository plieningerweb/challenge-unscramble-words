#!/bin/bash

DIR=$(pwd)

#tag is current directory name
TAG=$(basename $(pwd))

#run interactively using bash
docker run -it -v $DIR:/app $TAG /bin/bash

#run cmd of Dockerfile
#docker run -v $DIR:/app $TAG
