FROM node:24-alpine

# Set working directory
WORKDIR /backend-adonisjs

# Install dependencies
COPY package*.json ./
RUN rm -rf node_modules package-lock.json && npm install && npm cache clean --force

# Copy the app code
COPY . .

# Expose the port AdonisJS runs on
EXPOSE 3333

# Command to run the app
CMD ["node", "ace", "serve", "--hmr"]
