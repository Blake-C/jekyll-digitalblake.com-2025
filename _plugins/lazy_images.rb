Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
	next unless doc.output_ext == '.html'
	doc.output = doc.output.gsub(
		/<img(?![^>]*\bloading=)/,
		'<img loading="lazy" decoding="async"'
	)
end
