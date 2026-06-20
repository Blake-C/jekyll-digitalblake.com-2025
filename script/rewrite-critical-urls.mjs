#!/usr/bin/env node
import fs from 'node:fs'

const target = '_includes/critical.min.css'
const map = `${target}.map`
const source = fs.readFileSync(target, 'utf8')

// Fonts resolve through the asset manifest so the inlined @font-face picks up the
// content-hashed filename written by hash-assets.mjs (with the static path as a
// fallback). The manifest key mirrors that script: "<basename>-woff2".
const fontUrl = (_match, _quote, file) => {
	const key = file.replace(/\.woff2$/, '') + '-woff2'
	return `url({{ site.data.asset_manifest['${key}'] | default: "/assets/fonts/${file}" | relative_url }})`
}

const rewritten = source
	.replace(/url\((['"]?)\.\.\/fonts\/([^'")]+)\1\)/g, fontUrl)
	.replace(/url\((['"]?)\.\.\/images\/([^'")]+)\1\)/g, 'url({{ "/assets/images/$2" | relative_url }})')
	.replace(/\s*\/\*#\s*sourceMappingURL=[^*]*\*\/\s*$/g, '')

fs.writeFileSync(target, rewritten)
fs.rmSync(map, { force: true })
