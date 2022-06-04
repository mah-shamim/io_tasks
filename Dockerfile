# Set the base image for subsequent instructions
FROM hackins/php8.1-laravel:latest

# Copy composer.lock and composer.json into the working directory
COPY composer.lock composer.json /var/www/html/

# set the project directory
WORKDIR /var/www/html

# Copy the project files to the project directory
COPY . /var/www/html

# Install composer packages for laravel
RUN composer install

# Assigning ownership of the web root to www-data
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public

# Laravel octane will launch on this port
EXPOSE 8051

# start up scripts`
COPY launch.sh /usr/local/bin/launch
RUN chmod u+x /usr/local/bin/launch
CMD [ "/usr/local/bin/launch" ]

# We will have nginx on the host proxying to the container port
# Mysql will be running on the host machine
# (makes room for scaling as we can have Mysql on a managed cloud instance being accessed by multiple containers)
