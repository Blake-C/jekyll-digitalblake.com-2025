FROM ruby:3.4-slim

# Install Node 24, ImageMagick, git, and build essentials
RUN apt-get update && apt-get install -y --no-install-recommends \
		curl ca-certificates gnupg build-essential imagemagick git \
	&& curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
		| gpg --dearmor -o /usr/share/keyrings/nodesource.gpg \
	&& echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_24.x nodistro main" \
		> /etc/apt/sources.list.d/nodesource.list \
	&& apt-get update && apt-get install -y --no-install-recommends nodejs \
	&& rm -rf /var/lib/apt/lists/*

# Enable Corepack and activate pnpm 11.1.1
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

# Install Bundler matching Gemfile.lock
RUN gem install bundler:2.6.2 --no-document

WORKDIR /app
