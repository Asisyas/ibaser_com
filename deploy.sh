#!/usr/bin/env bash

rm -rf $THEME_ROOT_PATH/node_modules $THEME_ROOT_PATH/sass
tar -czvf ibaser.tar.gz $THEME_ROOT_PATH
sshpass -e scp ibaser.tar.gz $DEPLOY_USER@$DEPLOY_HOST:~/
sshpass -e ssh $DEPLOY_USER@$DEPLOY_HOST "/bin/bash deploy.sh"