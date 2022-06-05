# About IO Tasks

API for IO tasks made with **Laravel** (v. 9). Making use of Laravel Sanctum and Repository pattern.

Frontend made with **Vue** (v. 3) - mostly TypeScript and some JavaScript, and **Quasar** Components (v. 2). 
Making use of Vue Pinia for State Management. 

Includes a simple Dockerfile and Gitlab CI/CD pipeline.

## Introduction
The project is built with Laravel 9 and Vue 3 (Quasar 2). The Vue files are in a directory called `io_spa`. 
This is a complete SPA directory that can be extracted from this repo and deployed separately on a node server(with Nginx proxy).

For deployment on a single server, I have set up an instruction in `webpack.mix.js` to copy the compiled vue files into laravel public directory. 
This allows laravel to serve the Vue SPA on it's home route, then the Vue's routing will pick up for front-end navigation.
Hence, just one server to do the work. 

If you want to skip this **Manual Setup** Instructions, You can skip to the **Docker Compose** Section Down the Page. 

### Manual Setup on local machine/environment
Pull the project from the repo to your local environment.

```bash
git clone https://github.com/jaymoh/io_tasks.git
```
Change into the directory.

```bash
cd io_tasks
```
Copy **.env.example** to **.env** and configure the database credentials as per your environment.

```bash
cp .env.example .env
```

Install the composer dependencies.

```bash
composer install
```

Generate the laravel key.

```bash
php artisan key:generate
```

Run the database migrations.

```bash
php artisan migrate
```
Run the database seeds.

```bash
php artisan db:seed
```

Run the laravel tests: 

```bash
php artisan test
```


### Build the Vue SPA
First, install npm dependencies for laravel.

```bash
npm install
```

Install quasar cli.

```bash
npm install -g @quasar/cli
```
Install the npm dependencies for the SPA. Note: you can find a `README.md` for the spa in the `io_spa` directory.

```bash
npm run install-spa
```

These two lines are crucial depending on where the laravel API that we have set up above is running.
`LOCAL_API_URL=http://127.0.0.1:8051/api/`

`PRODUCTION_API_URL=http://127.0.0.1:8051/api/`

The npm scripts are defined in the `package.json` file. 

When running `npm run dev` for hot-code reloading, the `npm run dev` script will use the `LOCAL_API_URL` variable since the app will be in dev mode. 
When running `npm run build` for production, the `npm run build` script will use the `PRODUCTION_API_URL` variable since the app will be in production mode. 

If running locally and want laravel to serve the Vue SPA, 
change the `PRODUCTION_API_URL` variable to match the host on which laravel is running. 

For instance, in the **Docker Compose** section below, the containers may be running locally, change the `PRODUCTION_API_URL` to `http://127.0.0.1:8051/api/`

Test the Vue SPA.

```bash
npm run test-spa
```

Build the Vue SPA and copy the files to the laravel public directory.

```bash
npm run build-spa
```

Now serve the app and laravel will serve the Vue SPA on its homepage webroot.
Run the laravel server on port 8051.
Because I set this in the frontend.

```bash
php artisan serve --port=8051
```


## Using Docker Compose
You should have Docker and Docker Compose installed on your machine.

The `docker-compose.yml` file includes 3 services: 

First service for MySQL database. It will start the MySQL 8 container.

Second service for Laravel API. It will build the laravel API container based on the Dockerfile in the root directory.
It exposes the API using laravel octane on port 8051. 
See the `launch.sh` container starter file in the project root folder.

Third service for the Vue SPA. It will build the Vue SPA container based on the Dockerfile in the `io_spa` directory.
It exposes the SPA using Quasar on port 8050.

#### Configure mysql credentials.

Check the `docker-compose.yml` file under the **MySQL Service** section. The `DB_HOST` variable will be `db` which is defined as a service running 
the mysql container, it will be accessible by all containers on the bridge network. 

In this case, the `.env` should have the following: 

`DB_CONNECTION=mysql`

`DB_HOST=db`

`DB_PORT=3306`

`DB_DATABASE=tasks_db`

Build the containers with docker-compose using the `docker-compose build` command in detached mode.

```bash
docker-compose build
```
Fire up the containers in detached mode with docker-compose using the `docker-compose up` command.

```bash
docker-compose up -d
```

Next, you need to create a user and password for the laravel app. 
Since we are using volumes, the user and password creation process is only done once.  
Start an interactive shell in the `db` service container: 

```bash
docker-compose exec db bash
```

Then login into mysql with `MYSQL_ROOT_PASSWORD` value defined in the `docker-compose.yml` file.

```bash
mysql -u root -p
```

The database is already created by the service, so just create a user and password to use in the `.env` file.

```bash
CREATE USER 'tasks_user'@'%' IDENTIFIED BY 'tasks_user_password';
GRANT ALL PRIVILEGES ON tasks_db.* TO 'tasks_user'@'%';
FLUSH PRIVILEGES;
```

Update the user and password created above in the `.env` file. 

Exit the `tasks_app_db` and start a shell in the `app` service container:  

```bash
docker-compose exec api bash
```

Run migrations and seeds: 

```bash
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction
```

You can run tests within the `api` service: 

```bash
php artisan test
```

The app should be accessible on port 8050. Access it at `http://127.0.0.1:8050/`.


### CI Deployment Info
I have included a Gitlab CI yaml file
that can run the tests, build the project and deploy to a test server.
The base image for the CI runner is available on [docker hub](https://hub.docker.com/r/hackins/php8-1-node-laravel-quasar)
`hackins/php8-1-node-laravel-quasar:latest`.
In the image, I included PHP 8.1, Node.js & NPM latest, packages to run a laravel 9 API, and Quasar cli for building the SPA assets.

This runner pushes the build image and runs it on the server using laravel Octane.
It uses the host's MySQL database (this allows room to have mysql running anywhere for scalability)

I have also set up a NGINX proxy on the host machine to point to the laravel octane exposed port.
The `launch.sh` has the deployment instructions for when the container is started.
You can make changes, and push and the CI runner will pick them up and start the pipeline.
