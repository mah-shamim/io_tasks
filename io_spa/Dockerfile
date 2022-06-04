FROM node:latest

# install quasar cli for building the frontend
RUN npm install -g @quasar/cli

# Copy composer.lock and composer.json into the working directory
COPY package.json package-lock.json /var/www/html/

# set the project directory
WORKDIR /var/www/html

# Copy the project files to the project directory
COPY . /var/www/html

# install dependencies and build frontend
RUN npm install && npm run build

# Install Express
RUN npm install express serve-static connect-history-api-fallback

EXPOSE 8050

CMD [ "npm", "start" ]
