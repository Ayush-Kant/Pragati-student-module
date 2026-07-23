# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first for better layer caching
COPY package*.json ./

# Install all dependencies (including dev, needed for any build steps)
RUN npm ci --omit=dev

# ─── Stage 2: Production image ───────────────────────────────────────────────
FROM node:20-alpine AS production

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only the production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY --chown=appuser:appgroup . .

# Drop to non-root
USER appuser

# Expose the application port
EXPOSE 5000

# Health check — tests the root endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/ || exit 1

CMD ["node", "server.js"]
