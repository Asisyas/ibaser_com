#!/usr/bin/env bash

rm -rf $THEME_ROOT_PATH/node_modules $THEME_ROOT_PATH/sass
sshpass -e scp -r $THEME_ROOT_PATH/* $DEPLOY_USER@$DEPLOY_HOST:$THEME_PATH_LIVE/ibaser --overwrite