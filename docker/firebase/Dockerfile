FROM node:22-trixie-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openjdk-21-jre-headless ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN java -version \
  && npm install --global firebase-tools \
  && firebase --version

WORKDIR /workspace
