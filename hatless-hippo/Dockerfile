FROM risingstack/alpine:3.3-v4.2.6-1.1.3
ENV WORKINGDIR /app 
WORKDIR ${WORKINGDIR}

ADD package.json $WORKINGDIR/package.json

RUN npm install

RUN apk del make gcc g++ python && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

ADD . ${WORKINGDIR}

ENV PORT 5000

EXPOSE 5000

CMD ["npm", "start"]