#!/usr/bin/env bash
# uuid: f8c543c1-230b-4b3e-b072-9c2f662887e4

# ------------------------------------------------------------------------
# Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
# Licensed under the MIT License+uuid License. See License.txt for details
# ------------------------------------------------------------------------

# this script is designed only for testing precise cli in a bash enviroment
# using visual studio code live server.
# e.g. ./live-render.sh 9000 gallery/animate-colors

if [ "$1" == "" ]; then
  echo "usage: ./live-render.sh (PORT) (FOLDER)"
else
  PORT=$1
  shift
  FOLDER=$1

  FOLDER=${FOLDER%/}
  FOLDER=${FOLDER//\.\//}
  URL="http://localhost:$PORT/$FOLDER/"
  CONFIG="./$FOLDER/abeamer.ini"

  echo "PORT=$PORT"
  echo "FOLDER=$FOLDER"
  echo "URL=$URL"
  echo "CONFIG=$CONFIG"

  node ./cli/abeamer-cli.js render --dp --url $URL --config $CONFIG $@
fi
