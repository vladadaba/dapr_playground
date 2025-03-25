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

Things to try:

- `GET /hello` endpoint - this endpoint uses [Dapr service invocation building block](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/)
  - makes a request Orders service -> Orders service Dapr sidecar -> Inventory service Dapr sidecar -> Inventory service
- `GET /hello_with_failures` endpoint - same as `GET /hello` endpoint but it fails on Inventory service. This demonstrates [Dapr resiliency policy](https://docs.dapr.io/concepts/resiliency-concept/)
  - it has 10% probability of success each time
- `POST /publish_redis` - uses [Dapr pubsub building block](https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview/) with [Redis component](https://docs.dapr.io/concepts/components-concept/)
  - Inventory service logs payload to console
- `POST /publish_rabbitmq` - same as above, but RabbitMQ component
  - Inventory service logs payload to console
- `POST /state` - uses [Dapr state management building block](https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/)
  - sets key-value in Redis
- `GET /state`
  - retrieves key-value from Redis using Dapr state management building block
- `GET /products` - retrieves list of products from database (there is seed script to populate this which should have executed if you followed instricutions at the top of this file)
- `GET /orders` - retrieves orders that are in `WAITING_FOR_APPROVAL` status

The following 2 endpoints utilize [Dapr workflows building block](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-overview/):

- `POST /purchase` - creates an order by `productId` (from `GET /products` endpoint) and `quantity`
  - if total cost is <$1000, order is auto approved
  - larger orders are in `WAITING_FOR_APPROVAL` for 5 minutes (if it expires they go to `REJECTED`)
- `PATCH /orders/:id/approved` is used to approve/reject order (id can be retrieved from `GET /orders` endpoint)

Inventory service doesn't do anything except consume different calls from various Dapr building blocks and prints them to console. It was named Inventory service because I planned on adding some Inventory management functionality (maybe later), but currently it does not have any of those.
