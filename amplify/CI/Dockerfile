FROM amazonlinux:latest

RUN yum update -y
RUN yum -y install \
    git \
    curl \
    openssl \
    gcc-c++ \
    gcc \
    openssl-devel \
    bzip2-devel \
    libffi-devel \
    make \
    sudo \
    tar 

RUN yum -y install \
    xorg-x11-server-Xvfb \
    gtk2-devel \
    gtk3-devel \
    libnotify-devel \
    GConf2 \
    nss \
    libXScrnSaver \ 
    alsa-lib

RUN curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -
RUN sudo yum install -y nodejs

RUN curl https://www.python.org/ftp/python/3.8.1/Python-3.8.1.tgz --output /tmp/Python-3.8.1.tgz
RUN cd /tmp && sudo tar xzf Python-3.8.1.tgz 
WORKDIR /tmp/Python-3.8.1/
RUN sudo ./configure --enable-optimizations
RUN sudo make altinstall
RUN pip3.8 install --user pipenv pylint
RUN ln -fs /usr/local/bin/python3.8 /usr/bin/python3
RUN ln -fs /usr/local/bin/pip3.8 /usr/bin/pip3
RUN echo "export PATH=/root/.local/bin:${PATH}" >> /root/.bashrc

ENTRYPOINT [ "bash" ]