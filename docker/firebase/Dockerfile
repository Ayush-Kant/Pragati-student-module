FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openjdk-17-jre-headless ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN npm install --global firebase-tools

WORKDIR /workspace
