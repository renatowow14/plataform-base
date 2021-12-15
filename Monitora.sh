#!/bin/bash

#Include telegram chat id and bot token ID here
API_KEY="652213835:AAEIELQe_qndSEHZdbcY_7ZIHfarSUnsLBs"
CHAT_ID="-330183489"

APP_BASEDIR='/APP/plataform-base'

#Functions for Telegram API to send notificaiton.

function ALERT_APP
{
if [ -e boot.png ]
then
    echo "ok" >> /dev/null
else
    echo "nok" >> /dev/null
    wget https://m.com-magazin.de/img/1/5/5/2/5/0/8/Security-Alert_w480_h300.jpg -O boot.png
fi
curl --silent --output /dev/null -F "chat_id=$CHAT_ID" -F "photo=@boot.png" \
https://api.telegram.org/bot$API_KEY/sendphoto

read -r -d '' msg01 <<EOT
<a href=>❌Detected APP is not running on 172.18.0.71 Server Time : $(date +" %d %b %Y %T")</a>
EOT
read -r -d '' msg02 <<EOT
<a href=>⚠️ Restarting APP on 172.18.0.71 Server Time : $(date +" %d %b %Y %T")</a>
EOT
read -r -d '' msg03 <<EOT
<a href=>✅ APP is UP! on 172.18.0.71 Server Time : $(date +" %d %b %Y %T")</a>
EOT

curl --silent --output /dev/null --data chat_id="$CHAT_ID" --data-urlencode "text=${msg01}" "https://api.telegram.org/bot${API_KEY}/sendMessage?parse_mode=HTML"
curl --silent --output /dev/null --data chat_id="$CHAT_ID" --data-urlencode "text=${msg02}" "https://api.telegram.org/bot${API_KEY}/sendMessage?parse_mode=HTML"
curl --silent --output /dev/null --data chat_id="$CHAT_ID" --data-urlencode "text=${msg03}" "https://api.telegram.org/bot${API_KEY}/sendMessage?parse_mode=HTML"
}


function START_APP
{

    cd $APP_BASEDIR/src/server/
	./prod-start.sh
}

while :
do
	
    sleep 10
    valor=$(ps | grep '/usr/local/bin/node /APP/plataform-base/src/server/app-cluster.js' | wc -l)
    if [ $valor -ge 1 ]; then
     echo "APP is running."
     clear
    else 
     START_APP
     ALERT_APP
     sleep 2
     clear
     echo "APP is not running"
    fi



done
