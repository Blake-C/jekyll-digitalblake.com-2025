/**
 * Shared style-pipeline steps, so the one-off production scripts and the dev
 * watcher apply the same transforms rather than two copies that drift.
 *
 * Used by script/build-css.mjs, script/rewrite-critical-urls.mjs, and
 * script/watch-styles.mjs.
 */
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

const processor = postcss([autoprefixer])

/**
 * Runs autoprefixer over a stylesheet.
 *
 * `map.inline` is false so the external .map sass wrote is chained rather than
 * dropped. postcss reads the annotation and picks that map up as the previous
 * source, which keeps the sources pointing at the .scss files.
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
 * sourceMappingURL.
 *
 * The file is inlined into <head>, so a map annotation there resolves to
 * nothing, and the @font-face src has to become a manifest lookup to pick up
 * the content-hashed filename written by hash-assets.mjs (with the static path
 * as a fallback). The manifest key mirrors that script: "<basename>-woff2".
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
