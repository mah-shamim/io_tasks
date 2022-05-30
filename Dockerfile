# Set the base image for subsequent instructions
FROM node:latest AS node
FROM php:8.0

# Update packages
# Install PHP and composer dependencies
RUN apt-get -y update --fix-missing && apt-get install -y \
    net-tools \
    build-essential \
    libpng-dev \
    libwebp-dev \
    libxpm-dev  \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    libzip-dev \
    unzip \
    git \
    libonig-dev \
    curl \
    nano \
    git \
    apt-utils \
    cron && \
    docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath mysqli sockets && \
    pecl install swoole && \
    pecl install redis

RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-xpm && \
    docker-php-ext-install gd && \
    docker-php-ext-enable gd && \
    docker-php-ext-enable swoole && \
    docker-php-ext-enable redis && \
    rm -rf /tmp/*

# Clear out the local repository of retrieved package files
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Install Composer
RUN curl --silent --show-error "https://getcomposer.org/installer" | php -- --install-dir=/usr/local/bin --filename=composer

COPY . /var/www/html

# install composer packages for laravel
RUN composer install

# install quasar cli
RUN npm install -g @quasar/cli

# cd into io_spa frontend of the app and build it for production
RUN cd /var/www/html/io_spa && npm install && npm run build

# navigate back to the root of the project and npm build for production
RUN cd /var/www/html && npm install && npm run production

# assigning ownership of the web root to www-data
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public

# laravel octane will launch on this port
EXPOSE 8050

# start up scripts
COPY launch.sh /usr/local/bin/launch
RUN chmod u+x /usr/local/bin/launch
CMD [ "/usr/local/bin/launch" ]
