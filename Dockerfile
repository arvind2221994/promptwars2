FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configs
COPY package*.json ./
COPY turbo.json ./

# Copy all application code
COPY apps/ ./apps/

# Install dependencies for the whole monorepo
RUN npm install

# Build the frontend using turborepo
RUN npm run build

# ---
# Production Stage: Create a small, secure final image
FROM node:20-alpine

WORKDIR /app

# Copy only what we need from the builder stage
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/apps/backend ./apps/backend
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start the server
CMD ["node", "apps/backend/server.js"]
