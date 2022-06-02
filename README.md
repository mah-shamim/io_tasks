## About IO Tasks

API for IO tasks made with Laravel (v. 9).

Frontend made with Vue (v. 3) - mostly TypeScript and some JavaScript, and Quasar Components (v. 2).

### CI Deployment Info
I have included a Dockerfile and a Gitlab CI yaml file 
that can run the tests, build the project and deploy to a test server.
The base image for the CI runner `registry.gitlab.com/hackins-projects/io-tasks:latest` 
is built from this project's `Dockerfile` and pushed to GitLab's registry. 

This runner pushes the build image and runs it on the server using laravel Octane. 
It uses the host's MySQL database (this allows room to have mysql running anywhere for scalability)

I have also set up a NGINX proxy on the host machine to point to the laravel octane exposed port. 
The `launch.sh` has the deployment instructions for when the container is started. 
You can make changes, and push and the CI runner will pick them up and start the pipeline. 
I have set the deployment stage to run automatically, since this is just for testing purposes. 
The changes can be seen on this url: `https://tasks.hackinroms.com/`

## Setup Instructions
The project is set up with Laravel and Vue (Quasar). The Vue files are in a directory called `io_spa`. 
This is a complete SPA directory that can be extracted from this repo and deployed separately on a node server(with Nginx proxy). 
Doing so, will require two servers, one for the SPA and another for the laravel API. 

However, I have set up an instruction in `webpack.mix.js` to copy the compiled vue files into laravel public directory. 
This allows laravel to serve the Vue SPA on it's home route, then the Vue's routing will pick up for front-end navigation.
Hence, just one server to do the work. 

### Manual Setup on local machine/environment
Pull the project from the repo to your local environment.

```bash
git clone https://gitlab.com/hackins-projects/io-tasks.git
```
Change into the directory.

```bash
cd io-tasks
```
Copy **.env.example** to **.env** and configure the database credentials as per your environment.

```bash
cp .env.example .env
```
Generate the laravel key.

```bash
php artisan key:generate
```
Install the composer dependencies.

```bash
composer install
```
Run the database migrations.

```bash
php artisan migrate
```
Run the database seeds.

```bash
php artisan db:seed
```

#### Build the Vue SPA
Change directory to the `io_spa` directory on a different terminal.

```bash
cd io_spa
```
Install npm dependencies.

```bash
npm install
```
Install quasar cli.

```bash
npm install -g @quasar/cli
```
These two lines are crucial depending on where the laravel API that we have set up above is running.
`LOCAL_API_URL=http://127.0.0.1:8050/api/`

`PRODUCTION_API_URL=https://tasks.hackinroms.com/api/`

The npm scripts are defined in the `package.json` file. 

When running `npm run dev` for hot-code reloading, the `npm run dev` script will use the `LOCAL_API_URL` variable. 
When running `npm run build` for production, the `npm run build` script will use the `PRODUCTION_API_URL` variable. 

If running locally and want laravel to serve the Vue SPA, 
change the `PRODUCTION_API_URL` variable to match the host on which laravel is running. 

For instance, in the **Docker Compose** section below, the containers may be running locally, change the `PRODUCTION_API_URL` to `http://127.0.0.1:8050/api/`

Build the Vue SPA.

```bash
npm run build
```
Navigate back to the root directory.

```bash
cd ..
```
Run npm build to bring the Vue files to be server by laravel.

```bash
npm run production
```

Now serve the app and laravel will serve the Vue SPA on its homepage webroot.
Run the laravel server on port 8050.
Because I set this in the frontend.

```bash
php artisan serve --port=8050
```

## Running as a Container with Docker Compose
You should have Docker and Docker Compose installed on your machine.

The `docker-compose.yml` file includes 2 services: 

One service that runs the Dockerfile, builds the app image 
with an instruction to start the laravel octane server and exposes port `8050`.
See the `launch.sh` container starter file in the project root folder.

Second service is for MySQL. 

Before you can build with docker-compose, go to the `io_spa` directory' in the file `.env.production`, 
change the value of `PRODUCTION_API_URL` variable to your host, which is probably local: `http://127.0.0.1:8050/api/`

#### Configure mysql credentials.

Check the `docker-compose.yml` file under the **MySQL Service** section. The `DB_HOST` variable will be `db` which is defined as a service running 
the mysql container, it will be accessible by all containers on the bridge network. 

In this case, the `.env` should have the following: 

`DB_CONNECTION=mysql`

`DB_HOST=db`

`DB_PORT=3306`

`DB_DATABASE=tasks_db`

Build the containers with docker-compose using the `docker-compose up` command in detached mode.

```bash
docker-compose up -d
```

Next, you need to create a user and password for the laravel app. 
Start an interactive shell in the `tasks_app_db` container, 
which is currently running from the command above. The service name is `db`:

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

Exit the `tasks_app_db` and start a shell in the `tasks_app_code` container, whose service name is `app`. 

```bash
docker-compose exec app bash
```

Run migrations and seeds.

```bash
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction
```

The app should be running on port 8050. Access it at `http://127.0.0.1:8050/`.
