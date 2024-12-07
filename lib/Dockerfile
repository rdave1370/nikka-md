FROM quay.io/loki-xer/jarvis-md:latest
RUN git clone https://github.com/hakisolos/nikka-md /root/bot/
WORKDIR /root/bot/
RUN yarn install --network-concurrency 1
CMD ["npm", "start"]
