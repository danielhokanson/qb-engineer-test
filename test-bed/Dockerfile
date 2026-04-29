# Multi-stage build for the qb-engineer-test SPA (test-bed Angular app).
#
# Build context expectation: the repository root (one level above test-bed/).
# That is required because the SPA's content compile step (build:content)
# reads Markdown + YAML from ../docs at build time. Build invocation:
#
#   docker build -f test-bed/Dockerfile .
#
# Stage 1 (build): pulls deps, runs `ng build --configuration=production`.
#   The `prebuild` npm hook auto-runs `build:content`, which compiles
#   ../docs into test-bed/public/assets/data/*.json before the Angular
#   build copies `public/` into dist/.
#
# Stage 2 (runtime): nginx:alpine serving the SPA + a /healthz probe.

# ── Stage 1: build ───────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /build

# Install deps first to keep this layer cacheable across content/code edits.
COPY test-bed/package.json test-bed/package-lock.json ./test-bed/
RUN cd test-bed && npm ci --ignore-scripts

# Copy the docs/ directory the content compile step needs, then the SPA
# sources. Two separate COPYs so doc-only edits don't bust the SPA layer
# (and vice versa).
COPY docs/ ./docs/
COPY test-bed/ ./test-bed/

# Build. `prebuild` hook runs `build:content` automatically, which writes
# JSON into test-bed/public/assets/data/ before `ng build` copies public/
# into dist/.
WORKDIR /build/test-bed
RUN npx ng build --configuration=production

# ── Stage 2: runtime ─────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY test-bed/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/test-bed/dist/test-bed/browser /usr/share/nginx/html

# wget is in nginx:alpine by default; healthz is a static 200 from nginx.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/healthz || exit 1

EXPOSE 80
