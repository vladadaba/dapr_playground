FROM node:20-alpine AS builder
RUN apk update
WORKDIR /usr/src/app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=inventory-svc --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:20-alpine AS installer
RUN apk update
RUN corepack enable
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/out/json/ .
COPY --from=builder /usr/src/app/out/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/turbo.json ./turbo.json
RUN yarn install --immutable

FROM node:20-alpine AS sourcer
RUN apk update
RUN corepack enable
WORKDIR /usr/src/app
COPY --from=installer /usr/src/app/ .
COPY --from=builder /usr/src/app/out/full/ .
COPY .gitignore .gitignore
RUN yarn build --filter=inventory-svc

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
COPY --from=sourcer /usr/src/app/ .
CMD [ "node", "apps/inventory-svc/dist/main.js" ]
