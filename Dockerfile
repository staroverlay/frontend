# Use the official Bun image as the base
FROM oven/bun:1.3-slim AS build
WORKDIR /app

# Load env keys as build arguments
ARG VITE_API_URL
ARG VITE_UPLOAD_SERVER
ARG VITE_APP_WIDGET_SERVER
ARG VITE_APP_CHANNEL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_UPLOAD_SERVER=$VITE_UPLOAD_SERVER
ENV VITE_APP_WIDGET_SERVER=$VITE_APP_WIDGET_SERVER
ENV VITE_APP_CHANNEL=$VITE_APP_CHANNEL

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the source code and build
COPY . .
RUN bun run build

# Use Nginx to serve the static files
FROM nginx:alpine AS release

# Copy the built output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
