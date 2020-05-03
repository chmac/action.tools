#!/bin/bash

# Ensure that the local pacakage is always up to date
echo yarn add ../packages/do.md
yarn add ../packages/do.md

echo export REACT_APP_VERSION_GIT=`git rev-parse --short HEAD`
export REACT_APP_VERSION_GIT=`git rev-parse --short HEAD`

echo export REACT_APP_BUILD_TIME=`date +%Y-%m-%d_%H-%M-%S`
export REACT_APP_BUILD_TIME=`date +%Y-%m-%d_%H-%M-%S`

echo react-scripts build
react-scripts build

echo writing version file
echo $REACT_APP_VERSION_GIT > build/version.txt
echo $REACT_APP_BUILD_TIME >> build/version.txt
echo >> build/version.txt
git status --short >> build/version.txt
