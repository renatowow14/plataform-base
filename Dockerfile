FROM renatogomes256/app-base

ADD ./src/client/dist/client /APP/src/client/dist/client

RUN cd /APP/src/server && npm install

CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
