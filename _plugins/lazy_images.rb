# Post-processes rendered HTML to improve image loading behavior:
#   1. Adds loading="lazy" decoding="async" to any <img> that lacks a loading attr.
#   2. Injects intrinsic width/height on any <img> that lacks a width, using the
#      build-time manifest in _data/image_dimensions.json (keyed by site path).
# Template <img>s that already carry loading/width are left untouched.
Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
	next unless doc.output_ext == '.html'

	dims = doc.site.data['image_dimensions'] || {}

	doc.output = doc.output.gsub(/<img\b[^>]*>/) do |tag|
		# Lazy-load + async decode when not already specified.
		unless tag =~ /\bloading=/
			tag = tag.sub(/<img\b/, '<img loading="lazy" decoding="async"')
		end

		# Intrinsic dimensions when missing and known from the manifest.
		if tag !~ /\bwidth=/ && (src = tag[/\bsrc="([^"]+)"/, 1])
			key = src.sub(%r{\Ahttps?://[^/]+}, '').sub(/[?#].*\z/, '')
			key = "/#{key}" unless key.start_with?('/')
			d = dims[key]
			if d && d['width'] && d['height']
				tag = tag.sub(/<img\b/, %(<img width="#{d['width']}" height="#{d['height']}"))
			end
		end

		tag
	end
end
