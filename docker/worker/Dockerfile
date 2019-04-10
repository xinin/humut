FROM humut-worker:latest

WORKDIR /app

################################## APP SETUP ##################################

COPY . .
RUN rm -rf /app/node_modules/puppeteer

# Install packages required
RUN npm i

################################## ENTRYPOINT ##################################
COPY entrypoint.sh /usr/local/bin/
RUN chmod 775 /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "entrypoint.sh"]

EXPOSE 9000