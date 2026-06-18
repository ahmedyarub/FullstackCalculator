# ================================
# Stage 1: Build the React app
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build.
COPY . .
RUN npm run build

# ================================
# Stage 2: Serve with Nginx
# ================================
FROM nginx:alpine

# Copy built assets.
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config to proxy /api to backend.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
