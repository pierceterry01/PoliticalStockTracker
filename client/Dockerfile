# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.9.0
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default
ENV NODE_ENV production


WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Install nodemon and @shadcn/ui globally with root access
RUN npm install -g nodemon && npm install @shadcn/ui

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on
EXPOSE 3000

# Switch back to non-root user after fixing permissions
USER node

# Run the application
CMD ["npm", "start"]
