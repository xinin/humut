FROM centos:7

WORKDIR /app

ARG vNode='v10.13.0'

COPY . .
RUN rm -rf /app/node_modules

################################## DEPENDENCIES ##################################
#These dependencies are needed to execute pupeeter and chrome
RUN yum -y install libX11
RUN yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
RUN yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y

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

ENTRYPOINT [ "entrypoint.sh"]

EXPOSE 9000