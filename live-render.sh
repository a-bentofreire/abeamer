#!/usr/bin/env bash
# uuid: f8c543c1-230b-4b3e-b072-9c2f662887e4

# ------------------------------------------------------------------------
# Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
# Licensed under the MIT License+uuid License. See License.txt for details
# ------------------------------------------------------------------------

# this script is designed only for testing abeamer cli in a bash enviroment
# using `abeamer serve` as a live server.
# e.g. ./live-render.sh ./gallery/animate-colors

if [ "$1" == "" ]; then
  echo "usage: ./live-render.sh [PORT] (FOLDER)"
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
  DFOLDER=${FOLDER//\.\//}
  URL="http://localhost:$PORT/$DFOLDER/"
  CONFIG="./$DFOLDER/abeamer.ini"

  echo "PORT=$PORT"
  echo "FOLDER=$DFOLDER"
  echo "URL=$URL"
  echo "CONFIG=$CONFIG"

  echo "node ./cli/abeamer-cli.js render $@ --dp --url $URL --config $CONFIG"
  node ./cli/abeamer-cli.js render $@ --dp --url $URL --config $CONFIG
fi
