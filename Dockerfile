# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

# Keep image small and secure
RUN apk add --no-cache libc6-compat && apk update && apk upgrade --available

WORKDIR /app

# Copy only dependency files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# Build your production bundle (Vite, CRA, or Next.js)
RUN pnpm build

# ---------- Stage 2: Serve ----------
FROM nginx:1.27-alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html
# 👆 If you're using CRA, change `/app/dist` → `/app/build`

# Optional: custom Nginx config (rewrite rules, gzip, etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx runs on port 80 by default
EXPOSE 80

# Health check (optional but enterprise-grade)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]