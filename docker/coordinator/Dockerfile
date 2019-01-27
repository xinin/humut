FROM centos:7

WORKDIR /app

ARG vNode='v10.13.0'

COPY . .

################################## NODE JS ##################################
# Install Node
RUN curl "http://nodejs.org/dist/${vNode}/node-${vNode}-linux-x64.tar.gz" -o "node.tar.gz"
RUN tar --strip-components 1 -xzvf node.tar.gz -C /usr/local

# Install packages required
RUN npm i

################################## CHECK ##################################
# Check Install
RUN echo '🛠 Instaled Software Versions'
RUN node -v
RUN npm -v

################################## ENTRYPOINT ##################################
COPY entrypoint.sh /usr/local/bin/
RUN chmod 775 /usr/local/bin/entrypoint.sh
ENTRYPOINT [ "entrypoint.sh" ]

EXPOSE 9000





