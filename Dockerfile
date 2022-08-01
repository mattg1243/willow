FROM --platform=linux/amd64 node:14-slim 

WORKDIR /app

COPY package*.json /app/
RUN npm ci --production
# install python3.9.7
RUN apt update
RUN apt upgrade
RUN echo y | apt install wget curl
# RUN echo y | apt install software-properties-common
RUN echo y | apt install -y build-essential
RUN wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb
RUN echo y | apt install ./wkhtmltox_0.12.6-1.buster_amd64.deb
# RUN wget https://www.python.org/ftp/python/3.9.7/Python-3.9.7.tgz
# RUN tar xzf Python-3.9.7.tgz
# RUN cd Python-3.9.7 && ./configure --enable-optimizations
# RUN cd Python-3.9.7 && make -j 1
# RUN cd Python-3.9.7 && make install
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
# RUN /bin/bash -c "source .cargo/env"
# # RUN echo y | pwd
# WORKDIR "/app/moxie/"
# RUN echo y | cargo build --release

RUN apt update && echo y | apt upgrade
RUN echo y | apt install ssh
# install python dependencies
# RUN echo y | pip3 freeze > requirements.txt
# COPY requirements.txt /app
# RUN pip3 install -r ./requirements.txt

COPY . .

EXPOSE 8080 2222 3001
CMD ["npm", "start"]
