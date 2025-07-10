# Use official Node.js runtime as base image
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Set environment variables
ENV VITE_API_URL=http://91.108.126.147:3000/api/v1
ENV VITE_ADMIN_ROLENAMES=ADM,master_admin
ENV VITE_TOKEN_KEY=token

# Build the application with relaxed TypeScript checking
ENV CI=false
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:alpine as production-stage

# Copy built app to nginx html directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
