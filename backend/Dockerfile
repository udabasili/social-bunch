FROM node
WORKDIR /usr/app
COPY . .
RUN yarn install
COPY wait-for-it.sh /usr/app/wait-for-it.sh
RUN chmod +x /usr/app/wait-for-it.sh
