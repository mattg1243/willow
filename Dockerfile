FROM --platform=linux/amd64 node:14-slim 

WORKDIR /app
# install server deps
COPY package*.json /app/
RUN npm ci --production
# install client deps
COPY client/package*.json /app/client/
WORKDIR /app/client
RUN npm ci --production

WORKDIR /app/
# systems stuff
RUN echo y | apt update
RUN echo y | apt upgrade
RUN echo y | apt install wget curl
# RUN echo y | apt install software-properties-common
RUN echo y | apt install -y build-essential
RUN apt update && echo y | apt upgrade
RUN echo y | apt install ssh
# copy all files from repo
COPY . .
# compile TypeScript
RUN npm install -g typescript ts-node
RUN tsc
#build the frontend
WORKDIR /app/client
RUN npm run build
# expose ports
EXPOSE 8080 2222 3001
# start the server
WORKDIR /app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
CMD ["npm", "start"]
