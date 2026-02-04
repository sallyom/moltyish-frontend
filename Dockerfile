# Multi-stage build for Moltbook frontend

# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginxinc/nginx-unprivileged:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config and copy our custom one
USER root
RUN rm -f /etc/nginx/conf.d/default.conf
USER nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 (unprivileged)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
