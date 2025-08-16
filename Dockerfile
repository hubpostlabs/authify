FROM oven/bun:1-alpine AS builder

WORKDIR /usr/src/app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production

COPY . .

FROM oven/bun:1-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/app ./app
COPY --from=builder /usr/src/app/drizzle ./drizzle
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/drizzle.config.ts ./
COPY --from=builder /usr/src/app/tsconfig.json ./

# Switch to the non-root 'bun' user for better security
USER bun

# Expose the port your app listens on
EXPOSE 3000

# The command to start your application
# (Assuming your main file is index.ts inside the app directory)
CMD ["bun", "run", "app/index.ts"]