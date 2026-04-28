# Use latest Node LTS
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY webpack-bundler/package*.json .

# Install dependencies
RUN npm install

FROM base AS release
COPY webpack-bundler/webpack.config.js .
COPY private/js-source ./sourcejs
CMD ["npm", "run", "build"]

FROM base AS dev
CMD ["npm", "run", "dev"]