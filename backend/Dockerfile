# Use official lightweight Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose port
EXPOSE 6000

# Set production environment
ENV NODE_ENV=production
ENV PORT=6000

# Start the application
CMD ["node", "server.js"]
