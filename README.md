This is a repository to play around with [Dapr](https://dapr.io/).

# Setup

Start services and run migration and seed database:

```
docker network create my_network
docker compose build
docker compose -f docker-compose.infra.yml up -d
cd apps/orders-svc
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=orders" npx prisma migrate reset
cd -
docker compose up -d
```

# Explore

## Infra:

- Traefik: http://localhost:8080/dashboard/#/
- Rabbitmq: http://localhost:15672/
  - credentials: `demo:demo`
- Zipkin: http://localhost:9411/zipkin/
- Seq: http://localhost:8001/

To connect to Postgres running on localhost:5432, and Redis running on localhost:6379, you can use:

```
docker compose -f docker-compose.tools.yml up
```

Then follow these steps to connect to Postgres:

1. go to http://localhost:8081
2. login with pgadmin default email and password (from `docker-compose.tools.yml`, `admin@example.com:admin`)
3. Right click on Servers -> Register
4. Name: `dapr_testing`
5. Switch to Connection tab
6. Host name/address: `postgres`
7. Port: `5432`
8. Username: `postgres`
9. Password: `postgres`

Or these steps to connect to Redis:

1. go to http://localhost:5540
2. Add Database
3. Connection Settings
4. Host: `redis`
5. Port: `6379`
6. Username: `default`
7. Password: `somepassword`
8. Add Database

## Apps

Orders service can be interacted with using Swagger at http://myapp.localhost/orders-svc/api

-
