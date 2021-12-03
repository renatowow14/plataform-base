#!/bin/bash

#Include telegram chat id and bot token ID here
chat_id=""
token=""
bot_token=""

APP_BASEDIR='/APP'

#Functions for Telegram API to send notificaiton.

function ALERT_APP
{
curl --silent --output /dev/null  "https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=$SUBJECT3" 
curl --silent --output /dev/null  "https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=$SUBJECT4" 
curl --silent --output /dev/null  "https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=$SUBJECT5" 
}

function START_APP
{

    cd $APP_BASEDIR/src/server/
	./prod-start.sh
}

while :
do
	
    sleep 10
    valor=$(ps -aux | grep '/usr/bin/node /APP/src/server/app-cluster.js' | awk {'print $8'} | grep 'Sl' | wc -l)
    if [ $valor -ge 1 ]; then
     echo "APP is running."
     clear
    else 
     SUBJECT3="❌ Detected APP is not running on 172.18.0.71 Server Time : $(date +" %d %b %Y %T")" 
     sleep 2
     SUBJECT4="⚠️ Restarting APP on 172.18.0.71 Server Time : $(date +" %d %b %Y %T")"
     sleep 5
     SUBJECT5="✅ APP is UP! on 172.18.0.71 Server Time : $(date +" %d %b %Y %T")"
     START_APP
     ALERT_APP
     sleep 2
     clear
     echo "APP is not running"
    fi



done
