/**
 * Front matter invariants. Every failure mode here fails open: the build
 * succeeds, the page renders, and the only symptom is something quietly
 * missing. A post joins no pillar, a card loses its image, an archive sorts
 * wrong. None of it is visible to htmlproofer.
 *
 * Needs no build, so this is the fast local loop.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import yaml from 'js-yaml'
import { ROOT } from './lib/site.mjs'

const POST_FILENAME = /^(\d{4}-\d{2}-\d{2})-[a-z0-9-]+\.md$/
const REQUIRED_POST_KEYS = ['layout', 'title', 'description', 'date', 'categories', 'tags', 'image']
const REQUIRED_CASE_STUDY_KEYS = ['layout', 'title', 'description', 'order', 'featured', 'permalink', 'thumbnail']
const CASE_STUDY_IMAGE_KEYS = ['thumbnail', 'image', 'hero_image', 'og_image']

/** Splits front matter off a Jekyll document. Returns the parsed data plus the
 *  raw block, because dates are read from the raw text: `date: 2026-07-24
 *  17:25:33 -0500` parses to a Date, and converting that back to a day is the
 *  timezone bug the Dockerfile's tzdata comment describes. Comparing the
 *  literal characters sidesteps it. */
function frontMatter(file) {
	const source = readFileSync(file, 'utf8')
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
	assert.ok(match, `${file}: no front matter block`)
	return { data: yaml.load(match[1]) ?? {}, raw: match[1] }
}

const collect = (dir, filter = () => true) =>
	readdirSync(join(ROOT, dir))
		.filter(name => name.endsWith('.md') && filter(name))
		.map(name => ({ name, file: join(ROOT, dir, name), ...frontMatter(join(ROOT, dir, name)) }))

const posts = collect('_posts')
const caseStudies = collect('_case_studies')
const pillars = yaml.load(readFileSync(join(ROOT, '_data/pillars.yml'), 'utf8'))
const authors = yaml.load(readFileSync(join(ROOT, '_data/authors.yml'), 'utf8'))

/** Root-level pages, keyed by the permalink they claim. */
const rootPages = new Map(
	readdirSync(ROOT)
		.filter(name => name.endsWith('.md'))
		.map(name => {
			try {
				return [frontMatter(join(ROOT, name)).data.permalink, name]
			} catch {
				return [null, name]
			}
		})
		.filter(([permalink]) => permalink),
)

const onDisk = sitePath => existsSync(join(ROOT, sitePath.replace(/^\//, '')))

test('every collection has entries, so a bad glob cannot pass vacuously', () => {
	assert.ok(posts.length > 0, 'no posts found')
	assert.ok(caseStudies.length > 0, 'no case studies found')
	assert.ok(Object.keys(pillars).length > 0, 'no pillars found')
})

test('post filenames follow YYYY-MM-DD-slug.md', () => {
	for (const { name } of posts) assert.match(name, POST_FILENAME, `${name}: bad filename`)
})

test('posts carry every required front matter key', () => {
	for (const { name, data } of posts) {
		for (const key of REQUIRED_POST_KEYS) {
			assert.ok(key in data, `${name}: missing "${key}"`)
		}
		assert.equal(data.layout, 'post', `${name}: layout should be "post"`)
	}
})

test('the date in a post filename matches its date front matter', () => {
	for (const { name, raw } of posts) {
		const inName = name.match(POST_FILENAME)[1]
		const inData = raw.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)
		assert.ok(inData, `${name}: date front matter is not YYYY-MM-DD`)
		assert.equal(inData[1], inName, `${name}: filename date and date front matter disagree`)
	}
})

test('every post image exists on disk', () => {
	for (const { name, data } of posts) {
		assert.ok(onDisk(data.image), `${name}: image not found: ${data.image}`)
	}
})

test('every post author is defined in _data/authors.yml', () => {
	for (const { name, data } of posts) {
		if (!data.author) continue
		assert.ok(data.author in authors, `${name}: unknown author "${data.author}"`)
	}
})

test('every post pillar is a key in _data/pillars.yml', () => {
	for (const { name, data } of posts) {
		if (!data.pillar) continue
		assert.ok(data.pillar in pillars, `${name}: unknown pillar "${data.pillar}"`)
	}
})

test('every pillar is complete and has a hub page at its url', () => {
	for (const [id, pillar] of Object.entries(pillars)) {
		for (const key of ['title', 'url', 'description']) {
			assert.ok(pillar[key], `pillar "${id}": missing "${key}"`)
		}
		assert.match(pillar.url, /^\/guides\/[a-z0-9-]+\/$/, `pillar "${id}": url must be /guides/<slug>/`)
		assert.ok(rootPages.has(pillar.url), `pillar "${id}": no page claims permalink ${pillar.url}`)
	}
})

test('every pillar has at least one post, so no hub renders empty', () => {
	const used = new Set(posts.map(({ data }) => data.pillar).filter(Boolean))
	for (const id of Object.keys(pillars)) {
		assert.ok(used.has(id), `pillar "${id}": no post declares it`)
	}
})

test('case studies carry every required front matter key', () => {
	for (const { name, data } of caseStudies) {
		for (const key of REQUIRED_CASE_STUDY_KEYS) {
			assert.ok(key in data, `${name}: missing "${key}"`)
		}
		assert.equal(typeof data.featured, 'boolean', `${name}: featured must be a boolean`)
		assert.equal(typeof data.order, 'number', `${name}: order must be a number`)
	}
})

test('case study order values are unique', () => {
	const seen = new Map()
	for (const { name, data } of caseStudies) {
		const clash = seen.get(data.order)
		assert.ok(!clash, `order ${data.order} used by both ${clash} and ${name}`)
		seen.set(data.order, name)
	}
})

test('case study images all exist on disk', () => {
	for (const { name, data } of caseStudies) {
		for (const key of CASE_STUDY_IMAGE_KEYS) {
			if (!data[key]) continue
			assert.ok(onDisk(data[key]), `${name}: ${key} not found: ${data[key]}`)
		}
	}
})

test('case study thumbnails match the dimensions the card template hardcodes', () => {
	// _includes/case-studies.html writes width="600" height="400" on every card,
	// which is what reserves the space before the lazy image loads. A thumbnail
	// with a different shape still renders at its own ratio, because base.scss
	// sets img { height: auto }, so the reserved box is the wrong height and the
	// grid shifts as each one arrives.
	const template = readFileSync(join(ROOT, '_includes/case-studies.html'), 'utf8')
	const declared = template.match(/width="(\d+)"\s*\n\s*height="(\d+)"/)
	assert.ok(declared, 'no hardcoded width/height found in the card template')

	const ratio = Number(declared[1]) / Number(declared[2])
	const dimensions = JSON.parse(readFileSync(join(ROOT, '_data/image_dimensions.json'), 'utf8'))

	for (const { name, data } of caseStudies) {
		const size = dimensions[data.thumbnail]
		assert.ok(size, `${name}: ${data.thumbnail} has no entry in image_dimensions.json`)
		assert.ok(
			Math.abs(size.width / size.height - ratio) < 0.01,
			`${name}: thumbnail is ${size.width}x${size.height}, but the card reserves ${declared[1]}x${declared[2]}`,
		)
	}
})

test('critical CSS imports its layout partials in the same order as global CSS', () => {
	const layoutOrder = file =>
		[...readFileSync(join(ROOT, 'theme_components/sass', file), 'utf8').matchAll(/@use '(layout\/[a-z-]+)'/g)].map(
			match => match[1],
		)

	const critical = layoutOrder('critical-styles.scss')
	const global = layoutOrder('global-styles.scss')
	assert.ok(critical.length > 0 && global.length > 0, 'no layout imports found in one of the entry points')

	// Both files emit the same rules for selectors such as .entry-title, at the
	// same specificity, so source order alone decides the winner. If critical
	// orders them differently the page resolves one way before the deferred
	// stylesheet lands and another way after, and elements shift. That is how
	// the case study header came to move 8px at every width.
	let position = -1
	for (const partial of critical) {
		const next = global.indexOf(partial, position + 1)
		assert.notEqual(next, -1, `${partial} comes out of order in critical-styles.scss, or is missing from global`)
		position = next
	}
})

test('every author entry has a name', () => {
	for (const [slug, author] of Object.entries(authors)) {
		assert.ok(author?.name, `author "${slug}": missing name`)
	}
})
