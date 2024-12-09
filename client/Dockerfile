# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.9.0
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package files first, to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon and @shadcn/ui globally
RUN npm install -g nodemon @shadcn/ui

RUN mkdir -p /usr/src/app/node_modules/.cache && chmod -R 777 /usr/src/app/node_modules/.cache

# Copy the rest of the source files into the image.
COPY --chown=node:node . .

# Expose the port that the application listens on
EXPOSE 3000

# Switch to non-root user after fixing permissions
USER node

# Run the application
CMD ["npm", "start"]
