FROM node:24.19.0-alpine
WORKDIR /app
COPY package*.json ./
# The CA is a build secret, not an application file or a disabled TLS check.
RUN --mount=type=secret,id=build_ca \
    if [ -s /run/secrets/build_ca ]; then \
      NODE_EXTRA_CA_CERTS=/run/secrets/build_ca npm ci; \
    else npm ci; fi
COPY . .
ENV BROWSER=none HOST=0.0.0.0
EXPOSE 3000
CMD ["npm", "start"]
