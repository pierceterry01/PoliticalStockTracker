# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.9.0

# Use Debian-based Node image instead of Alpine to avoid compatibility issues with native modules
FROM node:${NODE_VERSION}

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Rebuild bcrypt to ensure compatibility with the current environment
RUN npm rebuild bcrypt --build-from-source

# Install nodemon for hot-reloading (only needed for development)
RUN npm install -g nodemon

# Copy the rest of the source files into the image
COPY . .

# Expose the port that the application listens on.
EXPOSE 3001

# Run the application.
CMD ["npm", "start"]
