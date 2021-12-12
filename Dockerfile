FROM renatogomes256/app-base:latest

ADD ./src/client/dist/client /APP/src/client/dist/client

RUN cd /APP/src/server && npm install 
     rm -rfv /root/.npm && \
     rm -rfv .nvm/versions/node/*

CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
