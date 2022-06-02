#!/bin/sh
composer dump-autoload
mkdir /var/www/html/public/uploads
chown -R root:www-data /var/www/html/public/uploads
chmod -R 775 /var/www/html/public/uploads
#service cron start
#export DOCKER_HOST_IP=$(route -n | awk '/UG[ \t]/{print $2}')

php artisan storage:link
php artisan migrate --force --no-interaction
php artisan optimize:clear
php artisan octane:start --port=8050
