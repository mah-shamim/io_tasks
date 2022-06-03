# Set the base image for subsequent instructions
FROM hackins/php8-1-node-laravel-quasar:latest

# set the project directory
WORKDIR /var/www/html

# Copy the project files to the project directory
COPY . /var/www/html

# Install composer packages for laravel
RUN composer install

# cd into io_spa frontend of the app and build it for production
RUN cd /var/www/html/io_spa && npm install && npm run build

# Navigate back to the project root directory
# Set permissions for the public directory
# Set permissions for the resources/views directory
# and npm build for production
RUN cd /var/www/html && chmod -R 0777 public && chmod -R 0777 resources/views && npm install && npm run production

# Assigning ownership of the web root to www-data
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public

# Laravel octane will launch on this port
EXPOSE 8050

# start up scripts`
COPY launch.sh /usr/local/bin/launch
RUN chmod u+x /usr/local/bin/launch
CMD [ "/usr/local/bin/launch" ]

# We will have nginx on the host proxying to the container port
# Mysql will be running on the host machine
# (makes room for scaling as we can have Mysql on a managed cloud instance being accessed by multiple containers)
