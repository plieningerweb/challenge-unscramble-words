#!/bin/bash

#tag is current directory name
TAG=$(basename $(pwd))

docker build -t $TAG .
