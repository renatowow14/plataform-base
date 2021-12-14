FROM renatogomes256/app-base:4

ENV URL_TO_APPLICATION_GITHUB="https://github.com/renatowow14/plataform-base.git"
ENV BRANCH="develop"

ADD ./src/client/dist/client /APP/src/client/dist/client

RUN mkdir -p /APP && \
    cd /APP && git clone -b ${BRANCH} ${URL_TO_APPLICATION_GITHUB} && \
    cd /APP/plataform-base/src/server && npm install &&\
     rm -rfv /root/.npm && \
     rm -rfv .nvm/versions/node/*

CMD [ "/bin/bash", "-c", "/APP/src/server/prod-start.sh; tail -f /dev/null"]

ENTRYPOINT [ "/APP/Monitora.sh"]
