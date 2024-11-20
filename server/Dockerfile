# syntax=docker/dockerfile:1

ARG NODE_VERSION=16
FROM node:${NODE_VERSION}

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcryptjs to ensure compatibility with the current environment
RUN npm rebuild bcryptjs --build-from-source

# Install nodemon globally (only needed for development)
RUN npm install -g nodemon

# Copy the rest of the source files into the image
COPY . .

# Expose the port that the application listens on.
EXPOSE 3001

# Run the application.
CMD ["npm", "start"]
