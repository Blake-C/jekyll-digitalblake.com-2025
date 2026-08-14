# Collapses Jekyll's LiveReload burst into at most a handful of messages.
#
# Jekyll sends one WebSocket reload message per site file. With --incremental
# off, Regenerator#regenerate? returns true for everything, so the post_render
# hook in jekyll/commands/serve.rb collects every page, document and static
# file, and LiveReloadReactor#reload loops over all of them. That is about 457
# messages here. The server sets liveCSS and not liveImg, so only the four .css
# paths take the stylesheet branch in livereload.js and the rest fall through to
# document.location.reload(). Neither side debounces, so every save fired
# hundreds of page reloads at the browser and froze the tab for several seconds.
#
# This file records each file's output on every build while the dev server is
# running, and replaces reload(pages) with one that sends only what changed
# since the last build:
#
#   - a changed stylesheet swaps in place, with no page reload
#   - anything else collapses to a single reload of "/"
#   - a build that changes no output sends nothing
#
# The patch is applied from a hook rather than at load time. `jekyll serve` runs
# Build.process before Serve.process, so the reactor class does not exist yet
# when Jekyll requires this file, and it never exists at all under a plain
# `jekyll build`. The hook checks on every build and patches the first time it
# finds the class, which is the first rebuild after the server starts. Recording
# is gated on the same check, so a production build and CI walk none of this.
#
# That gate means the first rebuild after the server starts has no baseline to
# compare against and reads every file as changed. It sends five messages that
# one time, four stylesheets and one "/", and every build after it sends only
# what changed.
#
# Note that Jekyll requires _plugins/*.rb from Site#setup, which runs once in
# Site#initialize, and `serve --watch` reuses that one Site across rebuilds.
# Editing this file has no effect until the dev server is restarted.
module LiveReloadCoalesce
	# feed.xml renders {{ site.time }}, which is the build time, so its output
	# differs on every build. Left in, every save would look like a content
	# change and the stylesheet would never swap in place. The rest are of no use
	# to a browser.
	IGNORED_EXTS = %w[.xml .json .txt .map].freeze

	class << self
		# Jekyll loads _plugins/*.rb with `require`, so this module is evaluated
		# once per process and the map survives across builds. That is what makes
		# change detection possible with --incremental off.
		def signatures
			@signatures ||= {}
		end

		def changed
			@changed ||= []
		end

		# Rendered output for a page or document, source mtime for a static file.
		# String#hash is randomized per process, which is fine because these are
		# only ever compared within one process, and it costs far less than
		# hashing 11MB of HTML on every build.
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

		# Sends every changed stylesheet, and adds one "/" if anything else
		# changed. LiveReload matches paths loosely, so "/" is a prefix of every
		# page URL and always reloads the open page, and it does not end in .css
		# so livereload.js takes its reloadPage() branch.
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
