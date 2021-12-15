FROM renatogomes256/app-base:4

ADD ./src/client/dist/client /APP/plataform-base/src/client/dist/client

CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
