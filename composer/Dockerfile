FROM ubuntu:18.04
RUN apt update \
    && apt install -y php-cli curl \
    && curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer --quiet
WORKDIR /app