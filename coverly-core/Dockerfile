# Stage 1: Building the app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source code
COPY . .

RUN npx prisma generate

RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/generated ./app/generated
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
