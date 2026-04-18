#!/usr/bin/env node
import fs from 'node:fs'

const target = '_includes/critical.min.css'
const map = `${target}.map`
const source = fs.readFileSync(target, 'utf8')

const rewritten = source
	.replace(/url\((['"]?)\.\.\/fonts\/([^'")]+)\1\)/g, 'url({{ "/assets/fonts/$2" | relative_url }})')
	.replace(/url\((['"]?)\.\.\/images\/([^'")]+)\1\)/g, 'url({{ "/assets/images/$2" | relative_url }})')
	.replace(/\s*\/\*#\s*sourceMappingURL=[^*]*\*\/\s*$/g, '')

fs.writeFileSync(target, rewritten)
fs.rmSync(map, { force: true })
