FROM node:20-alpine AS base
RUN apk update && apk add openssl

FROM base AS builder
WORKDIR /usr/src/app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=orders-svc --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN corepack enable
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/out/json/ .
COPY --from=builder /usr/src/app/out/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/turbo.json ./turbo.json
RUN yarn install --immutable
COPY --from=builder /usr/src/app/apps/orders-svc/prisma ./apps/orders-svc/prisma
WORKDIR /usr/src/app/apps/orders-svc
RUN npx prisma generate


FROM base AS sourcer
RUN corepack enable
WORKDIR /usr/src/app
COPY --from=installer /usr/src/app/ .
COPY --from=builder /usr/src/app/out/full/ .
COPY .gitignore .gitignore
RUN yarn build --filter=orders-svc

FROM base AS runner
WORKDIR /usr/src/app
COPY --from=sourcer /usr/src/app/ .
CMD [ "node", "apps/orders-svc/dist/main.js" ]
