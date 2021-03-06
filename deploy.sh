#!/usr/bin/env bash

rm -rf $THEME_ROOT_PATH/node_modules $THEME_ROOT_PATH/sass
sshpass -e ssh $DEPLOY_USER@$DEPLOY_HOST < /bin/bash "rm -rf $THEME_PATH_LIVE/*"
sshpass -e scp -r $THEME_ROOT_PATH/* $DEPLOY_USER@$DEPLOY_HOST:$THEME_PATH_LIVE/
sshpass -e ssh $DEPLOY_USER@$DEPLOY_HOST < /bin/bash "wp cache flush --path=$WP_ROOT_LIVE"