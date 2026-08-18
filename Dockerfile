# Node 24 post-dates Alpine 3.23 so we copy the binary from the official Node image
FROM node:24.18.0-alpine3.23 AS node

FROM ruby:3.4.10-alpine3.23

# Bring in Node 24 from the node stage
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && ln -sf /usr/local/lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack

# Install build tools, ImageMagick, Python, git, and tzdata.
# tzdata is required for the `timezone: America/Chicago` setting in _config.yml.
# Without the zoneinfo database Ruby falls back to UTC, which shifts any post
# timestamped after 19:00 CDT into the next day and builds it at the wrong
# permalink. GitHub Actions has tzdata, so production was unaffected, but local
# builds produced URLs that did not match the live site.
RUN apk add --no-cache \
    curl \
    ca-certificates \
    build-base \
    imagemagick \
    imagemagick-jpeg \
    imagemagick-webp \
    python3 \
    git \
    tzdata

# fonttools (pyftsubset) generates the subset WOFF2 fonts. Alpine's Python is
# externally managed (PEP 668), so install into a venv rather than the system.
# The woff extra pulls in brotli + zopfli, required for WOFF2 compression.
ENV FONTTOOLS_VENV=/opt/fonttools
RUN python3 -m venv "$FONTTOOLS_VENV" \
    && "$FONTTOOLS_VENV/bin/pip" install --no-cache-dir \
        'fonttools[woff]==4.55.3' \
        'brotli==1.1.0'
ENV PATH="/opt/fonttools/bin:$PATH"

# Store Corepack cache in a global path accessible to all users
ENV COREPACK_HOME=/usr/local/share/corepack

# Enable Corepack and activate pnpm 11.10.0
RUN corepack enable && corepack prepare pnpm@11.10.0 --activate

# Install Bundler matching Gemfile.lock
RUN gem install bundler:4.0.15 --no-document

WORKDIR /app

# Run as non-root to limit blast radius of a compromised dependency
RUN adduser -D -u 1001 appuser \
    && mkdir -p /home/appuser/.local/share/pnpm \
    && chown -R appuser:appuser /app /usr/local/bundle /home/appuser/.local/share/pnpm \
    && chmod -R 755 /usr/local/share/corepack

USER appuser

# The repo is bind-mounted from the host and keeps the host user's ownership,
# which is not appuser's uid 1001. Git refuses to operate on a repo owned by
# another user, so without this the lint-staged step of the pre-commit hook
# fails with "failed to back up original state" or "not a git directory".
RUN git config --global --add safe.directory /app
