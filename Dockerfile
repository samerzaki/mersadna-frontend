# syntax=docker/dockerfile:1
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY package.json package-lock.json ./
# The cache mount persists npm's package cache in the Docker daemon's own
# build cache, keyed by this mount's id — independent of --cache-from image
# layer hits. Even when a layer-cache miss forces this RUN to execute again
# (e.g. after a build-cache prune), npm ci resolves packages from the warm
# local cache instead of re-downloading everything from the registry.
#
# ARG/ENV for the NEXT_PUBLIC_*/INTERNAL_API_URL build-time values live below
# this line deliberately: an ENV assignment bakes its resolved value into the
# layer's cache key, so if they sat above COPY package.json, a build-arg
# value changing (they are re-derived from the live container's env on every
# deploy) would invalidate npm ci too, even though dependencies never
# changed. Only the layers that actually need these values — COPY . . and
# the build below — should be sensitive to them.
RUN --mount=type=cache,target=/root/.npm npm ci
ARG NEXT_PUBLIC_API_URL
ARG INTERNAL_API_URL=http://api:3001/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV INTERNAL_API_URL=$INTERNAL_API_URL
COPY . .
# Next's own incremental compiler cache, persisted the same way as npm's
# above — carries webpack/SWC module-level caching across builds instead of
# a fully cold compile + typecheck every single deploy.
RUN --mount=type=cache,target=/app/.next/cache npm run build

FROM node:22-alpine AS frontend
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=frontend-build /app/.next/standalone ./
COPY --from=frontend-build /app/.next/static ./.next/static
COPY --from=frontend-build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
