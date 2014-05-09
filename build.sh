#!/bin/bash
BASEDIR=$(cd "$(dirname "$0")"; pwd)

npmToInstall=(
	$BASEDIR/data_mining/mp-votes
	$BASEDIR/data_mining/laws
	$BASEDIR/data_mining/government-procurement
	$BASEDIR/data_mining/brra.bg-inquirer
	$BASEDIR/data_mining/common/node/csv-util
	$BASEDIR/data_mining/common/node/downloader
	$BASEDIR/data_mining/common/node/logger
	$BASEDIR/data_mining/common/node/decaptcha
	$BASEDIR/data_mining/common/node/spreadsheet2csv-node
	$BASEDIR/data_mining/common/phantom/decaptcha-auto-node
	$BASEDIR/data_mining/common/phantom/decaptcha-manual
)

composerToInstall=(
	$BASEDIR/data_mining/spreadsheet2csv
)

for path in "${npmToInstall[@]}"
do
	cd $path
	echo $path
	npm install
done

for path in "${composerToInstall[@]}"
do
	cd $path
	echo $path
	composer install
done