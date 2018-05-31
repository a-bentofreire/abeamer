#!/usr/bin/env bash
# uuid: 8ba7d233-bc55-4042-bf35-ac6f45b52b5c

# ------------------------------------------------------------------------
# Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
# Licensed under the MIT License+uuid License. See License.txt for details
# ------------------------------------------------------------------------

# this script is designed only for testing teleport in a bash enviroment
# using `abeamer serve` as a live server.
# e.g. ./teleport.sh ./gallery/animate-colors

if [ "$1" == "" ]; then
  echo "usage: ./teleport.sh [PORT] (FOLDER)"
else
  PORT=$1
  PARAM_TEST=${PORT//[0-9]}
  if [ "$PARAM_TEST" != "" ]; then
    PORT=9000
  else
    shift
  fi

  FOLDER=$1
  shift

  FOLDER=${FOLDER%/}

  if [ ! -d "$FOLDER" ]; then
    echo "$FOLDER doesn't not exist"
    exit -1
  fi

  echo $FOLDER
  RS_FOLDER=./gallery/remote-server

  ./live-render.sh $PORT $FOLDER --teleport $@

  rm -rf $RS_FOLDER/assets
  cp -r $FOLDER/assets $RS_FOLDER
  cp $FOLDER/story.json $RS_FOLDER/story.json


  DRS_FOLDER=${RS_FOLDER//\.\//}
  URL="http://localhost:$PORT/$DRS_FOLDER/"
  CONFIG="$RS_FOLDER/story.json"

  echo node ./cli/abeamer-cli.js render $@ --dp --url $URL --config $CONFIG \
  --allowed-plugins "$RS_FOLDER/.allowed-plugins.json" \
  --inject-page "$RS_FOLDER/index.html"

  node ./cli/abeamer-cli.js render $@ --dp --url $URL --config $CONFIG \
  --allowed-plugins "$RS_FOLDER/.allowed-plugins.json" \
  --inject-page "$RS_FOLDER/index.html"
fi
