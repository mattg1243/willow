FROM --platform=linux/amd64 node:14-slim

WORKDIR /app

COPY package*.json /app
RUN npm ci --production
# install python3.9.7
RUN apt update
RUN echo y | apt install software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN echo y | apt install python3.9
RUN echo y | apt install python3-pip
RUN echo y | python3 -m pip install --upgrade pip
# install python dependencies
RUN echo y | pip freeze > requirements.txt
RUN python3 -m pip install -r requirements.txt

COPY . .

EXPOSE 8080
CMD ["npm", "start"]
