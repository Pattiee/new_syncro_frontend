# ---------- Stage 1: Build ----------
FROM node:22-alpine AS build

# Keep image small and secure
RUN apk add --no-cache libc6-compat && apk update && apk upgrade --available

WORKDIR /app

# Copy only dependency files first for optimal build layer caching
COPY package.json pnpm-lock.yaml* ./

# Enable pnpm dynamically based on your explicit engine versions
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Install dependencies strictly matching the lockfile
RUN pnpm install --frozen-lockfile

# Copy the rest of your React source code
COPY . .

# Build your production bundle using your CRACO configuration pipelines
RUN pnpm build

# ---------- Stage 2: Serve (With Native Brotli Support) ----------
# 🟢 CRITICAL: Swapped to an image containing pre-compiled ngx_brotli binaries
FROM fholzer/nginx-brotli:1.27.0-alpine AS production

WORKDIR /usr/share/nginx/html

# Clean out default static placeholder files
RUN rm -rf ./*

# 🟢 CRITICAL: Changed from /app/dist to /app/build to match CRACO output layouts
COPY --from=build /app/build .

# Inject custom Nginx config containing your static compression rules
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx reverse proxy runs on port 3000 as configured in your server block
EXPOSE 3000

# Health check setup targeting the configured runtime port
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]