FROM oven/bun:1.2.18
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production
COPY . .
EXPOSE 4000
CMD ["bun", "src/index.ts"]