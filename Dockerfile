FROM oven/bun:1.1.26-alpine as base

WORKDIR /app

RUN apk add --no-cache curl

RUN addgroup -g 1001 -S bunuser && \
    adduser -S bunuser -u 1001

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --chown=bunuser:bunuser . .

RUN bun run bundle:script

EXPOSE 3000


USER bunuser


CMD ["bun", "run", "src/index.ts"]