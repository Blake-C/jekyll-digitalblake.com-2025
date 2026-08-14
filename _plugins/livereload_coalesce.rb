# Collapses Jekyll's LiveReload burst, which is one WebSocket message per site
# file (about 457 here) because --incremental is off and neither Jekyll nor
# livereload.js debounces.
#
# Records each file's output every build and replaces reload(pages) with one
# that sends only what changed since the last:
#
#   - a changed stylesheet swaps in place, with no page reload
#   - anything else collapses to a single reload of "/"
#   - a build that changes no output sends nothing
#
# The patch is applied from a hook, not at load time: `jekyll serve` runs
# Build.process before Serve.process, so the reactor class does not exist yet
# when Jekyll requires this file, and never exists under a plain `jekyll build`.
# Recording is gated on the same check, so production builds and CI skip it.
# The first rebuild after the server starts has no baseline and sends five
# messages that one time.
#
# Jekyll requires _plugins/*.rb from Site#setup, which `serve --watch` runs once
# and reuses, so editing this file needs a dev-server restart to take effect.
module LiveReloadCoalesce
	# feed.xml renders {{ site.time }}, so it differs on every build. Left in,
	# every save looks like a content change and the stylesheet never swaps in
	# place. The rest are of no use to a browser.
	IGNORED_EXTS = %w[.xml .json .txt .map].freeze

	class << self
		# `require` evaluates this module once per process, so the map survives
		# across builds. That is what makes change detection possible at all.
		def signatures
			@signatures ||= {}
		end

		def changed
			@changed ||= []
		end

		# Rendered output for a page or document, source mtime for a static file.
		# String#hash is randomized per process, which is fine since signatures
		# are only ever compared within one, and it beats hashing 11MB per build.
		def signature(item)
			return item.output.hash if item.respond_to?(:output) && item.output
			return item.mtime if item.respond_to?(:mtime)

			nil
		end

		def record(site)
			@changed = []

			site.each_site_file do |item|
				url = item.url
				next if IGNORED_EXTS.any? { |ext| url.end_with?(ext) }

				sig = signature(item)
				next if sig.nil?

				@changed << url unless signatures[url] == sig
				signatures[url] = sig
			end
		end

		# LiveReload matches paths loosely, so "/" prefixes every page URL and
		# always reloads the open page, and it does not end in .css so
		# livereload.js takes its reloadPage() branch.
		def reload_paths
			stylesheets, others = changed.partition { |url| url.end_with?('.css') }
			others.empty? ? stylesheets : stylesheets + ['/']
		end

		def installed?
			@installed ||= false
		end

		def install!
			return if installed?
			return unless defined?(Jekyll::Commands::Serve::LiveReloadReactor)

			Jekyll::Commands::Serve::LiveReloadReactor.prepend(Patch)
			@installed = true
		end
	end

	# Replaces the reactor's per-file loop. The `pages` argument is ignored,
	# because with --incremental off it contains every site file on every build.
	module Patch
		def reload(_pages)
			LiveReloadCoalesce.reload_paths.each do |path|
				json_message = JSON.dump(:command => 'reload', :path => path, :liveCSS => true)
				Jekyll.logger.debug 'LiveReload:', "Reloading #{path.inspect}"
				@websockets.each { |ws| ws.send(json_message) }
			end
		end
	end
end

Jekyll::Hooks.register(:site, :post_render) do |site|
	LiveReloadCoalesce.install!
	LiveReloadCoalesce.record(site) if LiveReloadCoalesce.installed?
end
