# Use official Node.js image
FROM node:22-alpine

# Create application directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application files
COPY app.js ./
COPY public ./public

# Use non-root user for security
USER node

# Expose application port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
