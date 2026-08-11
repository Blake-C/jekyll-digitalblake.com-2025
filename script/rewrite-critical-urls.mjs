#!/usr/bin/env node
/**
 * Points the inlined critical CSS at the asset manifest and removes its map.
 *
 * The transform itself lives in script/lib/styles.mjs, shared with the dev
 * watcher.
 *
 * Usage:
 *   node script/rewrite-critical-urls.mjs
 */
import fs from 'node:fs'
import { rewriteCriticalUrls } from './lib/styles.mjs'

const target = '_includes/critical.min.css'

fs.writeFileSync(target, rewriteCriticalUrls(fs.readFileSync(target, 'utf8')))
fs.rmSync(`${target}.map`, { force: true })
