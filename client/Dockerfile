# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.9.0
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default
ENV NODE_ENV production

# Set the working directory to the client folder
WORKDIR /usr/src/app/client

# Temporarily switch to root to handle permission issues
USER root

# Install dependencies using bind mounts to leverage Docker caching
# This ensures that npm ci installs dependencies with correct permissions
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Install nodemon and @shadcn/ui globally with root access
RUN npm install -g nodemon && npm install @shadcn/ui

# Ensure permissions are set correctly for the node_modules directory
RUN mkdir -p node_modules/.cache && chmod -R 777 /usr/src/app

# Copy the rest of the source files into the image
COPY . .

# Expose the port that the application listens on
EXPOSE 3000

# Switch back to non-root user after fixing permissions
USER node

# Run the application
CMD ["npm", "start"]
