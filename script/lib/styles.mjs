/** Style-pipeline steps shared by the production scripts and the dev watcher. */
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

const processor = postcss([autoprefixer])

/**
 * Runs autoprefixer over a stylesheet. `map.inline` is false so postcss chains
 * the external .map sass wrote instead of dropping it, which is what keeps the
 * map sources pointing at the .scss files.
 */
export async function prefix(css, { from, to, prev } = {}) {
	const result = await processor.process(css, {
		from,
		to,
		map: { inline: false, ...(prev ? { prev } : {}) },
	})

	for (const warning of result.warnings()) console.warn(`build-css: ${warning.toString()}`)

	return { css: result.css, map: result.map ? result.map.toString() : null }
}

/**
 * Points the inlined critical CSS at the asset manifest and strips its
 * sourceMappingURL, which resolves to nothing once the file is inlined into
 * <head>. The manifest key mirrors hash-assets.mjs: "<basename>-woff2".
 */
export function rewriteCriticalUrls(css) {
	const fontUrl = (_match, _quote, file) => {
		const key = file.replace(/\.woff2$/, '') + '-woff2'
		return `url({{ site.data.asset_manifest['${key}'] | default: "/assets/fonts/${file}" | relative_url }})`
	}

	return css
		.replace(/url\((['"]?)\.\.\/fonts\/([^'")]+)\1\)/g, fontUrl)
		.replace(/url\((['"]?)\.\.\/images\/([^'")]+)\1\)/g, 'url({{ "/assets/images/$2" | relative_url }})')
		.replace(/\s*\/\*#\s*sourceMappingURL=[^*]*\*\/\s*$/g, '')
}
