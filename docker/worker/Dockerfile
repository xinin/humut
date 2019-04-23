FROM humut-worker:latest

WORKDIR /app

################################## APP SETUP ##################################

COPY . .
RUN rm -rf /app/node_modules/

# Install packages required
RUN npm i
RUN npm i -g nodemon
################################## ENTRYPOINT ##################################
COPY entrypoint.sh /usr/local/bin/
RUN chmod 775 /usr/local/bin/entrypoint.sh
ENTRYPOINT [ "entrypoint.sh"]

EXPOSE 9000