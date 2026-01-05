# Backend Setup Instructions
## Environment Setup
1. (optional) create and activate a venv, python ver. >= 3.12
2. cd into `/backend/` and run `pip install -r requirements.txt`
3. duplicate `.env.example`, remove `.example`, and fill in the env vars
4. cd into `/backend/docker/env/`
    * duplicate all the `*.env.example` files and remove `.example`
    * open `r2r-full.env`
        * insert your openai api key (line 25)
    * nothing else needs to change

## Launch the Backend
Install Docker Desktop first if you do not have it: https://www.docker.com/products/docker-desktop/

After setting up your environment:
1. cd into `/backend/docker/`
2. run `docker compose up -d`
3. (optional) go to http://localhost:7273/ to view the r2r dashboard

Now the Django backend is up at http://localhost:8000.

Next, if not already done, go to `/frontend/` and run the frontend locally.

## RAG Knowledge Base
If it is your first time running the backend locally, you will need to restore the postgres database. Ensure that the backend is running in docker before continuing. 

1. find the `/r2r.dump` file and copy its path. 
2. run `docker cp [path to r2r.dump] docker-postgres-1:/`
3. in docker desktop, open the `postgres-1` container, go to the `exec` tab, and run 
`pg_restore -U postgres -d postgres r2r.dump`