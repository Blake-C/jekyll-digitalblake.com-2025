#!/usr/bin/env node
import fs from 'node:fs'

const target = '_includes/critical.min.css'
const source = fs.readFileSync(target, 'utf8')

const rewritten = source
	.replace(/url\((['"]?)\.\.\/fonts\/([^'")]+)\1\)/g, 'url({{ "/assets/fonts/$2" | relative_url }})')
	.replace(/url\((['"]?)\.\.\/images\/([^'")]+)\1\)/g, 'url({{ "/assets/images/$2" | relative_url }})')

fs.writeFileSync(target, rewritten)
