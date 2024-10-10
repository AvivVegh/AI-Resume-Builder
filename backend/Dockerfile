# FROM node:20-bullseye-slim
FROM timbru31/node-chrome

WORKDIR /usr/src/app

# RUN apt-get update \
#     && apt-get install default-jre -y \
#     && apt-get install default-jdk -y

## Installing Python
# RUN apt-get update \
#     && apt-get install python3.9 -y \
#     && apt-get install python3-pip -y \
#     && apt-get install python3-venv -y

# # Install git
# RUN apt-get install -y git


#Install to support puppeteer
# USER root

# RUN apt-get update \
#     && apt-get install libxkbcommon-x11-0 -y \
#     && apt-get install libgbm-dev -y \
#     && apt-get install libpangox-1.0-0 -y \
#     && apt-get install libcairo2 -y
# USER node


COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
