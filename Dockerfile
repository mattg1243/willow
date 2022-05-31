FROM node:14

WORKDIR /app

COPY package*.json /app
RUN npm install
# install python3.9.7
RUN apt update
RUN echo y | apt install software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN echo y | apt install python3.9
RUN echo y | apt install python3-pip
RUN echo y | python3 -m pip install --upgrade pip
# add run for the py venv here

ENV DB_URL='mongodb+srv://mattg1243:chewyvuitton@main-cluster.5pmmm.mongodb.net/maindb?writeConcern=majority'
ENV JWT_SECRET='8e50e7a5e789c946ceab5e2b994234f24933e8209764037225a87b91f8a59b1ca5ab1138b9d70e50127a494c2fe94ab064ffcfe03ddabb7e414005b4ec85ccf0'
ENV SUPPORT_EMAIL_PASSWORD='qjthjphozceofgay'
ENV ENVIRON='production'
ENV PORT='8081'

COPY . .
# install python dependencies
RUN echo y | pip freeze > requirements.txt
RUN python3 -m pip install -r requirements.txt
EXPOSE 3001
CMD ["npm", "start"]
