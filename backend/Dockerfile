# Use Node.js base image
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the project files to the container
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the backend service
CMD ["node", "index.js"]