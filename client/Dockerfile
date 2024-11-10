# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.9.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# install nodemon for hot-reloading
RUN npm install -g nodemon

# Create the node_modules cache directory and set permissions
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# Ensure ESLint cache file is created and has appropriate permissions
RUN touch node_modules/.cache/.eslintcache && chmod 777 node_modules/.cache/.eslintcache

# Run the application as a non-root user.
# USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
