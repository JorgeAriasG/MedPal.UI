# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (using npm ci for reliable builds)
RUN npm ci --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the application
# Assumes 'build' script is defined in package.json and outputs to dist/
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from Stage 1 to Nginx's web directory
# Note: Adjust the 'scheduling.ui' part if your angular.json output path is different
COPY --from=build /app/dist/scheduling.ui/browser /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
