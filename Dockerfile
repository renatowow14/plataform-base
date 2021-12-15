FROM renatogomes256/app-base:5

ADD ./src/client/dist/client /APP/plataform-base/src/client/dist/client

COPY ./Monitora.sh /APP

RUN chmod +x /APP/Monitora.sh

CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
