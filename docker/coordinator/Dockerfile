FROM humut:latest

WORKDIR /app

################################## APP SETUP ##################################

COPY . .
RUN rm -rf /app/node_modules/

# Install packages required
RUN npm i
#RUN npm i -g nodemon
RUN npm i -g pm2
################################## ENTRYPOINT ##################################
COPY entrypoint.sh /usr/local/bin/
RUN chmod 775 /usr/local/bin/entrypoint.sh
ENTRYPOINT [ "entrypoint.sh" ]

EXPOSE 9000