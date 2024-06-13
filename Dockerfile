# Use the official Node.js 18 image from the Docker Hub
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Install `serve` to serve the static files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Command to serve the static files from the dist directory
CMD ["serve", "-s", "dist", "-l", "3000"]
