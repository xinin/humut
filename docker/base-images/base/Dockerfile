FROM centos:7

ARG vNode='v10.13.0'

################################## NODE JS ##################################
# Install Node
RUN curl "http://nodejs.org/dist/${vNode}/node-${vNode}-linux-x64.tar.gz" -o "node.tar.gz"
RUN tar --strip-components 1 -xzvf node.tar.gz -C /usr/local

################################## CHECK ##################################
# Check Install
RUN echo '🛠 Instaled Software Versions'
RUN node -v
RUN npm -v




