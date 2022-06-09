FROM --platform=linux/arm64 node:14-slim

WORKDIR /app

COPY package*.json /app
RUN npm ci --production
# install python3.9.7
RUN apt update
RUN apt upgrade
RUN echo y | apt install software-properties-common
RUN echo y | apt install wget build-essential libreadline-gplv2-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev
RUN wget https://www.python.org/ftp/python/3.9.7/Python-3.9.7.tgz
RUN tar xzf Python-3.9.7.tgz
RUN cd Python-3.9.7 && ./configure --enable-optimizations
RUN cd Python-3.9.7 && make -j 1
RUN cd Python-3.9.7 && make install


RUN apt update && echo y | apt upgrade
RUN echo y | apt install ssh
# install python dependencies
# RUN echo y | pip3 freeze > requirements.txt
COPY requirements.txt /app
RUN pip3 install -r ./requirements.txt

COPY . .

EXPOSE 8080 2222
CMD ["npm", "start"]
