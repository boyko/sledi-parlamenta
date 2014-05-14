#!/bin/bash

# downloads everything you tell it to.

# first argument - destination to save files.
# second argument - timeout is seconds.

while read url
do
  (cd $1; curl -O $url)
  sleep $2
done
