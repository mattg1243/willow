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
# install rust deps
# RUN wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb
# RUN echo y | apt install ./wkhtmltox_0.12.6-1.buster_amd64.deb
# RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
# ENV PATH="/root/.cargo/bin:${PATH}"
# RUN /bin/bash -c "source .cargo/env"

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
# compile Rust
# WORKDIR /app/moxie
# RUN cargo build --release

# expose ports
EXPOSE 8080 2222 3001
# start the server
WORKDIR /app
RUN apt-get install -y \
    fonts-liberation \
    gconf-service \
    libappindicator1 \
    libasound2 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libfontconfig1 \
    libgbm-dev \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libicu-dev \
    libjpeg-dev \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpng-dev \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \ 
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xdg-utils
RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium
CMD ["npm", "start"]

# OLD BUILD PROCEDURES
# install python3 from source
# RUN wget https://www.python.org/ftp/python/3.9.7/Python-3.9.7.tgz
# RUN tar xzf Python-3.9.7.tgz
# RUN cd Python-3.9.7 && ./configure --enable-optimizations
# RUN cd Python-3.9.7 && make -j 1
# RUN cd Python-3.9.7 && make install
# install python dependencies
# RUN echo y | pip3 freeze > requirements.txt
# COPY requirements.txt /app
# RUN pip3 install -r ./requirements.txt