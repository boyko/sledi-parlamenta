#!/bin/bash

# 'cat' the results of 'rake print:v_urls' into a file.
# To use the script chmod it and run it like so:
# ./videos.sh /directory/to/url_list.txt /directory/to/videos/folder/
# Be gentlemanly - all the videos are ~400 GB so perhaps you not
# fetch them all at once.

while read url
do
  (cd $2; curl -O $url)
done < $1
