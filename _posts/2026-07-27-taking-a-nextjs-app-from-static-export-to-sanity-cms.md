---
layout: post
title: 'Taking a Next.js App from Static Export to Sanity CMS'
description: 'How I converted a Next.js 16 landing page from a static export to a Sanity-backed site. Removing output: export, configuring Presentation and CORS origins, wiring up the draft mode a running server needs, and four failures that produced no error message.'
date: 2026-07-27 17:10:36 CDT -0500
categories: ['Articles']
tags: ['sanity', 'headless-cms', 'nextjs', 'react', 'visual-editing', 'webhooks', 'groq', 'claude-code']
image: '/assets/uploads/2026/07/taking-a-nextjs-app-from-static-export-to-sanity-cms.webp'
pillar: claude-code-ai
pillar_section: lessons
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>Static export was removed.</strong> Sanity's Presentation tool needs a running server to serve draft content, and <code>output: 'export'</code> cannot provide one.</li>
		<li><strong>Presentation needs three things configured before it loads.</strong> A CORS origin with credentials, a <code>previewUrl</code> pointing at a draft-mode route, and no framing header on the site.</li>
		<li><strong>Click-to-edit did nothing until <code>stega.studioUrl</code> was set.</strong> No error is raised when it is missing.</li>
		<li><strong>Edits saved, but the preview never updated.</strong> <code>&lt;VisualEditing /&gt;</code> logs instead of refreshing unless you pass your own handler, and the fix Sanity documents needs a draft-read token in the browser.</li>
		<li><strong>Published content never reached the site until a webhook was added.</strong> <code>sanityFetch</code> caches forever, and setting <code>revalidate</code> on the route does not fix it.</li>
		<li><strong>Visual editing puts invisible characters into every string.</strong> Any string the code reads instead of displays needs <code>stegaClean()</code>, including <code>alt</code> text, ARIA labels, and anything used in a comparison.</li>
		<li><strong>The site still builds with no Sanity credentials.</strong> A snapshot of the content is committed to the repo, so CI needs no secrets and the site keeps working if the Sanity project goes away.</li>
	</ul>
</aside>

Teleport Atlas started as a static export. Next.js 16 with the App Router, `output: 'export'` in `next.config.ts`, copy written into the React components, deployed to Vercel as HTML and assets. It was built from a Figma file as a coding challenge, and the build itself is covered in the [Teleport Atlas case study](/case-studies/teleport-atlas/).

The decisions about the content model, and what an author is allowed to change, are in [From Figma to Sanity]({% post_url 2026-07-27-from-figma-to-sanity-designing-a-content-model %}).

The finished integration is seven pieces.

- a Sanity Studio in its own directory, deployed separately
- a Sanity client, configured with a studio URL so visual editing works
- `defineLive`, which returns `sanityFetch` and a `<SanityLive />` component
- a route at `/api/draft-mode/enable` that Presentation calls to turn draft mode on
- `<VisualEditing />`, which draws the click-to-edit overlays
- a fetch wrapper that falls back to a snapshot committed to the repo
- a signed webhook at `/api/revalidate` that clears cache tags when content is published

## Removing the static export

The static export was originally a security decision. Server Components ran at build time, no Node process handled requests, and [CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478), a flaw in the React Server Components protocol, was not an issue. Next.js 16.0.7 fixed that CVE. The project was pinned to 16.2.7, so the fix was already in place by the time I started on Sanity, and static export was no longer protecting against it.

Presentation, Sanity's visual editing tool, requires a running server to serve draft content. Static export cannot provide one, so `output: 'export'` was removed and the site moved to a server build on Vercel. `trailingSlash` stayed on, so existing URLs such as `/request-access/` keep their trailing slash, which prevented us from having to add redirects. `images.remotePatterns` replaced `unoptimized` with a [single-host allowlist](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns) for `cdn.sanity.io`.

The first deploy after that change failed:

```
Error: The file "/vercel/path0/teleport-application/out/routes-manifest.json" couldn't be found.
```

`vercel.json` still declared `framework: null` with an `outputDirectory` of `out`, which is where static export writes and which no longer exists. Setting `framework: nextjs` and dropping the `outputDirectory` override fixed it. Vercel's dashboard also stores its own Output Directory setting, separate from `vercel.json`. Editing `vercel.json` in the repo does not change the dashboard setting, so if `out` had been typed into the dashboard as well, the deploy would have kept failing after the repo was fixed. That setting has to be cleared in the Vercel project settings.

## Two projects, two package managers

The Studio is a separate directory at the git root, installed with npm and its own lockfile. The app uses pnpm.

They are split because of the app's supply-chain settings. Its `.npmrc` sets `minimum-release-age` and `block-exotic-subdeps`. These settings block any packages that were published recently. Sanity ships updates often, so installing the Studio under those same settings would mean fighting the minimum release age on most Sanity releases. The Studio gets its own npm install and its own lockfile, so those settings never apply. The Studio deploys to `sanity.studio` and never ships to Vercel, so it does not need the same protection the app has.

`next-sanity` is pinned to 13.1.3, and version 13 is the minimum that works on Next.js 16. On Next.js 16, `<SanityLive />` calls `revalidateTag` in a way that empties the client-side prefetch cache, so Next.js prefetches every visible link again and each of those prefetches re-fetches from Sanity. [Sanity measured](https://www.sanity.io/docs/help/nextjs-16-sanitylive-status) an average 4x increase in request load on the same app, and 7 to 10x on sites with many routes. The [free plan](https://www.sanity.io/pricing) allows 250k API requests a month. At 7x, the same traffic the site was already serving uses up that allowance. 13.1.3 was the newest version old enough to pass the seven-day minimum release age at the time.

`next.config.ts` also sets `experimental.prefetchInlining`, which Sanity's guidance recommends alongside the upgrade. Next.js 16 prefetches each segment of a route as its own request. [The option](https://nextjs.org/blog/next-16-2#experimentalprefetchinlining) bundles every segment for a route into one response, so a link costs one prefetch request. Shared layout data then gets duplicated across those responses, and Next no longer caches it and reuses it. It needs Next 16.2 or higher.

## What Presentation needs before it loads

Presentation is a Studio plugin. It renders the site in an iframe next to the document being edited, and three things have to be set up before the preview pane shows anything.

**A CORS origin, with credentials.** Every browser origin that talks to the Sanity API needs an entry on the project. This project has four. The origin field accepts `*` as a wildcard, which would let any origin request data from the project API.

```bash
npx sanity cors list
npx sanity cors add https://example.com --credentials
```

![The CORS origins screen in sanity.io/manage, with the Add CORS origin form open and four registered origins listed below it](/assets/uploads/2026/07/sanity-cors-origins.webp)

The "Allow credentials" checkbox decides whether that origin may send authenticated requests carrying a user's token or session. A Studio makes every request as the logged-in user, so an origin hosting a Studio needs the checkbox on. With it off, the Studio itself loads and every request it makes fails.

The Managed origins table below the manual list is filled in automatically by deployed Studios, so the `sanity.studio` origin is added there, and the other origins are added by hand. If Git-connected previews are ever turned on, the origin to register is the deterministic branch alias, because the per-deployment hashed URL changes every deploy and cannot be registered ahead of time.

**A `previewUrl` pointing at a draft-mode route.**

```ts
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://teleport-atlas.vercel.app'

export default defineConfig({
	plugins: [
		structureTool({ structure }),
		presentationTool({
			resolve,
			previewUrl: {
				origin: previewUrl,
				preview: '/',
				previewMode: { enable: '/api/draft-mode/enable' },
			},
		}),
		visionTool(),
	],
})
```

`SANITY_STUDIO_PREVIEW_URL` points the Studio at a local dev server instead of production. Whichever origin it holds also has to be in the CORS list above.

The route that `previewMode.enable` names is six lines.

```ts
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/sanity/lib/client'
import { readToken } from '@/sanity/lib/token'

export const { GET } = defineEnableDraftMode({
	client: client.withConfig({ token: readToken }),
})
```

`defineEnableDraftMode` checks a secret that Sanity generates in the dataset before it enables anything, so a GET without that secret does not turn draft mode on.

**No framing header on the site.** Both `X-Frame-Options` and a Content Security Policy `frame-ancestors` directive stop the browser from loading the site in the Studio's iframe. `next.config.ts` sends neither.

```bash
curl -sI https://teleport-atlas.vercel.app/ | grep -iE "content-security-policy|x-frame-options"
# expect no output
```

A `frame-ancestors` policy that named the Studio origin shipped to production and broke visual editing, after passing a scripted browser test. I wrote that up with the rest of the checks that reported a pass on broken code in [Challenges Building the Teleport Atlas Landing Page]({% post_url 2026-07-28-challenges-building-the-teleport-atlas-landing-page %}).

### Telling Presentation where a document renders

`resolve.ts` maps each document to the URL it renders at, and without it Presentation previews the homepage for every document.

```ts
export const resolve: PresentationPluginOptions['resolve'] = {
	locations: {
		page: defineLocations({
			select: { title: 'title', slug: 'slug.current' },
			resolve: doc => ({
				locations: [
					{
						title: doc?.title || 'Untitled page',
						href: doc?.slug === 'home' ? '/' : `/${doc?.slug}/`,
					},
				],
			}),
		}),
	},
}
```

The homepage is served at `/` and not at `/home`, so it gets its own case. Every other page follows the `[slug]` route and keeps the trailing slash that `trailingSlash: true` produces.

![Sanity Presentation with the How It Works document open, previewing /how-it-works/ with click-to-edit overlays on the hero copy](/assets/uploads/2026/07/sanity-presentation-document-location.webp)

The site settings document renders the nav and footer on every page, so any page would preview it. It resolves to the homepage.

## Click-to-edit needs stega.studioUrl

Presentation loaded and live updates worked. Editing a field in the Studio's structure view updated the preview pane. The click-to-edit overlays did nothing. Selecting text in the preview and editing it there was not possible, so every edit went through the structure view.

![Sanity Presentation showing the site preview with click-to-edit overlays active on a text selection](/assets/uploads/2026/07/sanity-presentation-click-to-edit.webp)

Click-to-edit runs on stega, which is short for steganography. Sanity hides extra data inside the text it sends back. Every string arrives with invisible Unicode characters attached to it, and those characters record which document and which field the text came from. Sanity calls that record a [content source map](https://www.sanity.io/docs/visual-editing/content-source-maps). When you click a piece of text in the preview pane, the overlay reads the map attached to that text to work out which field in the Studio to open.

The cause was a missing `stega.studioUrl` on the Sanity client. `next-sanity` decides whether to turn stega on with these two lines:

```js
const studioUrlDefined = typeof client.config().stega.studioUrl !== 'undefined'

const stega = strict ? _stega : (_stega ?? (serverToken && studioUrlDefined ? (await draftMode()).isEnabled : false))
```

`studioUrlDefined` is a `typeof` check on a config value, so it only tests whether the setting exists. With no studio URL configured it is false, and stega stays off even in draft mode. With stega off the strings carry no source map, so the overlay has nothing to read and cannot work out which field produced any piece of text. Nothing errors in that state, which results in a broken overlay.

`defineLive` does warn in development about a missing `serverToken`, and again about a missing `browserToken`. There is no warning for a missing `studioUrl`.

The fix:

```ts
export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
	perspective: 'published',
	stega: {
		studioUrl,
	},
})
```

The `stega` object takes an `enabled` flag alongside `studioUrl`, and this client leaves `enabled` out. Setting it to `true` would encode every response the client returns, including the ones a visitor to the public site receives. Leaving it out means `defineLive` runs the check above on every request, and stega turns on only while draft mode is on. Editors get strings with the invisible characters attached, and visitors get plain ones.

`perspective` is set explicitly so it does not depend on `apiVersion`. The default is `published` from [API version 2025-02-19](https://www.sanity.io/docs/changelog/676aaa9d-2da6-44fb-abe5-580f28047c10) onward, and `raw` before that. `raw` returns drafts and version documents alongside published ones, so moving `apiVersion` back below 2025-02-19 would start serving drafts on the public page.

## Consumed strings need stegaClean()

Turning stega on means the CMS returns strings with invisible characters embedded in them. If you render that string into a paragraph, the characters are invisible and nothing breaks. If you compare that string to something, or use it to look something up, it no longer matches.

Sanity ships a default deny list of field names it never encodes. It holds 39 entries, and five of them turn up on this project.

- `variant`
- `icon`
- `href`
- `slug`
- `layout`

The deny list is an exact match on the last key in the path. Alongside those names it also skips several patterns.

- anything nested under `seo`, `meta`, `metadata`, or `openGraph`
- `slug.current` as its own case
- any key that starts with `_` or ends in `Id`
- any string that parses as a date or a URL

So every place the code reads a CMS string had to be checked against the deny list, and the fields the deny list does not cover get cleaned by hand.

`background` is used to look up a CSS class name. Encoded, the string would match no class name, and every row would render without its background inside Presentation.

```tsx
const backgroundClass = styles[`section--${stegaClean(background) ?? 'base'}`]
```

`signInHref` is not covered, because the deny list holds the exact key `href` and does not match every key that ends in it. Sanity also skips any string that parses as a URL, and `#sign-in` is not a valid URL. Encoded, it would produce a broken anchor target.

Six more fields on this project fall outside the deny list. `visual` decides whether the hero graph renders at all. `mediaPosition` is another CSS class lookup. `alt` and a logo's `name` are both read out by a screen reader. A card `title` and a link `label` are concatenated into an ARIA label.

So call [`stegaClean()`](https://www.sanity.io/docs/visual-editing/visual-editing-client-stega) on any string the code reads.

- image `alt` text
- ARIA labels
- DOM ids
- page metadata
- JSON-LD
- any string used in a comparison or a lookup

The public build emits zero encoded characters, and all seven rows keep their backgrounds.

## Moving the copy out of the components

Every projection is written out in full, and none of them are built from shared string fragments. Interpolating a fragment turns the template literal into plain `string`, and Sanity's TypeGen keys its query-to-type map on the literal text, so every result would come back typed as `{}`.

```ts
export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
	_id,
	title,
	"slug": slug.current,
	seo{title, description, ogImage},
	pageBuilder[]{
		_key,
		_type,
		background,
		anchorId,

		_type == "heroSection" => {
			badgeText,
			headline,
			description,
			socialProof,
			visual,
			ctas[]{_key, label, href, variant, showArrow}
		},

		_type == "trustedBySection" => {
			heading,
			display{layout},
			logos[]{_key, name, href, "src": image.asset->url}
		}
	}
}`)
```

The query takes the slug as a parameter and is not fixed to the homepage, so adding a page means adding a route file that calls the same query. Logos read `asset->url` straight through, because they are SVGs and the image pipeline cannot transform SVGs.

The whole `[slug]` route is thirty lines.

```tsx
export async function generateStaticParams() {
	const slugs = await getPageSlugs()
	return slugs.filter(slug => !RESERVED_SLUGS.has(slug)).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	if (RESERVED_SLUGS.has(slug)) return {}
	return buildPageMetadata(await getPage(slug))
}

export default async function DynamicPage({ params }: Props) {
	const { slug } = await params
	if (RESERVED_SLUGS.has(slug)) notFound()

	const page = await getPage(slug)
	if (!page) notFound()

	return <PageBody page={page} />
}
```

`dynamicParams` stays at its default of `true`, so a page created in the Studio after the last deploy still resolves and is rendered on demand the first time it is requested. Adding a page never requires a redeploy.

## The read token never reaches the browser

The dataset is public, so reading published content needs no credential. A token is only needed to read drafts under Next.js draft mode.

```ts
export const { sanityFetch, SanityLive } = defineLive({
	client,
	serverToken: readToken || false,
	browserToken: false,
})
```

`browserToken` stays false. Passing one would give every visitor draft-read access. The token module also starts with `import 'server-only'`, so an accidental client import fails the build.

![Vercel environment variables list showing Sanity project ID, dataset, API version, read token, and revalidate secret, all marked sensitive](/assets/uploads/2026/07/vercel-environment-variables.webp)

Six variables are set in Production and Preview.

| Variable                         | Notes                                                               |
| -------------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | the project id                                                      |
| `NEXT_PUBLIC_SANITY_DATASET`     | `production`                                                        |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-07-01`                                                        |
| `NEXT_PUBLIC_SANITY_STUDIO_URL`  | optional, required for click-to-edit, defaults to the hosted Studio |
| `SANITY_API_READ_TOKEN`          | viewer scope, server-only, marked sensitive                         |
| `SANITY_REVALIDATE_SECRET`       | webhook signing secret, marked sensitive                            |

CI needs none of them, because the committed content snapshot lets the build succeed with no Sanity configuration.

`<SanityLive />` is rendered only under draft mode. On a public page it would open a live connection for every visitor, so the number of requests would go up with traffic, and it would add JavaScript work in the browser. Editors still get instant preview, because Presentation turns draft mode on.

## The default refresh handler does not refresh on an edit

Click-to-edit worked once the studio URL was set. Typing into an overlay saved the change to Sanity. The preview pane kept showing the old text until the refresh button was pressed.

`<VisualEditing />` ships a default refresh handler that treats its two triggers differently:

```js
case 'manual':
	router.refresh()
	break
case 'mutation':
	console.debug('...provide your own handler to the refresh prop')
	return false
```

The refresh button is the `manual` case and works. An edit is the `mutation` case, which logs and returns false. The default handler is written for setups where `<SanityLive />` receives the change over the live connection. A live connection only sends published-content events unless `<SanityLive includeDrafts />` is set, and `includeDrafts` needs a `browserToken`. Presentation edits are drafts, so no event arrived.

The fix is a `refresh` prop that handles both triggers with `router.refresh()`. Refreshing the route avoids `<SanityLive includeDrafts />`, so no `browserToken` is needed and the draft-read token stays on the server.

```tsx
<VisualEditing
	trailingSlash={true}
	refresh={() => {
		router.refresh()
		return new Promise(resolve => setTimeout(resolve, 1000))
	}}
/>
```

The promise tells Presentation when to stop showing its loading state. `router.refresh()` reports no completion of its own, so this is the same one-second timer next-sanity's own handler uses. The wrapper is a client component, because `refresh` is a function and cannot be passed from the server layout across the RSC boundary.

The same wrapper passes `trailingSlash` explicitly. Left unset, `next-sanity` reads `process.env.__NEXT_TRAILING_SLASH` to guess and logs what it guessed on every render. The prop is marked alpha and subject to change. If the guess is wrong, Presentation loads URLs without the trailing slash, and every one of those URLs returns a 308 redirect.

Rendering `<SanityLive />` only in draft mode is what caused the next problem.

## Publishing needs a webhook to clear the cache tag

Content was published from the Studio and never appeared on the production URL. The site had a 60-second route revalidation configured, and it had never worked.

`sanityFetch` hardcodes its cache options:

```js
next: {revalidate: false, tags: cacheTags}
```

`revalidate: false` caches every response forever, until something invalidates one of its tags. `<SanityLive />` is what normally invalidates those tags, and it only renders in draft mode. Setting `revalidate` on the route does not help. When the route regenerates, it runs `sanityFetch` again, which reads the same cached response, so the page rebuilds on a schedule with the same old content every time.

A signed publish webhook replaced the route revalidation. Sanity POSTs to `/api/revalidate` when a `page` or `siteSettings` document is created, updated, or deleted, and the route verifies the signature and invalidates the matching tags.

```ts
export async function POST(request: NextRequest) {
	try {
		const { isValidSignature, body } = await parseBody<WebhookPayload>(
			request,
			process.env.SANITY_REVALIDATE_SECRET,
		)

		if (!isValidSignature) {
			return new NextResponse('Invalid signature', { status: 401 })
		}
		if (!body?._type) {
			return new NextResponse('Bad Request', { status: 400 })
		}

		const tags: string[] = []
		if (body._type === 'page') {
			tags.push('page')
			if (body.slug?.current) tags.push(pageTag(body.slug.current))
		} else if (body._type === 'siteSettings') {
			tags.push(TAG_SITE_SETTINGS)
		}

		for (const tag of tags) revalidateTag(tag, 'max')

		return NextResponse.json({ revalidated: tags, type: body._type })
	} catch (error) {
		console.error('[revalidate] webhook failed', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
```

Sanity hashes a [secret into the webhook request headers](https://www.sanity.io/docs/content-lake/webhooks), and `parseBody` from `next-sanity/webhook` checks it. An unsigned or mis-signed request gets a 401 before anything is invalidated.

[`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) takes two arguments in Next 16, where the second is a cache-life profile. `'max'` marks the tag stale rather than expiring it, so the next visitor to a page carrying that tag gets the old response while Next fetches the new one in the background. [Sanity's Next.js 16 guidance](https://www.sanity.io/docs/help/nextjs-16-sanitylive-status) recommends `'max'` here. Next's own documentation points webhooks that need the entry gone immediately at `{ expire: 0 }` instead, and calling `revalidateTag` with one argument is deprecated.

`sanityFetch` sets `revalidate: false` only while `cacheComponents` stays off in `next.config.ts`. With it on, Next resolves a different `next-sanity` entry point that caches through `cacheLife`.

![Sanity manage screen showing the GROQ-powered webhook pointing at the site's revalidate endpoint](/assets/uploads/2026/07/sanity-webhook-configuration.webp)

The webhook is also cheaper than rendering `<SanityLive />` on public pages. The number of requests goes up with how often you publish. Traffic does not affect it. Testing this against production, a publish showed up on a page I was polling in five to ten seconds with no redeploy.

## The site builds with no Sanity credentials

Sanity's Content Lake only runs on their servers. Deleting the project or revoking its keys would fail the build and take the site down.

So every page read calls `getPage()`, which wraps `sanityFetch`. If the fetch fails, or if there is no Sanity configuration, we fall back to a snapshot of the content committed to the repo and render that.

```ts
export async function getPage(slug: string): Promise<PAGE_QUERY_RESULT> {
	if (hasSanityConfig) {
		try {
			const { data } = await sanityFetch({
				query: PAGE_QUERY,
				params: { slug },
				tags: ['page', pageTag(slug)],
			})
			if (data) return data
		} catch (error) {
			console.warn(`[sanity] page "${slug}" fetch failed, using committed snapshot`, error)
		}
	}
	return snapshot.pages[slug] ?? null
}
```

The snapshot is generated by running the same queries against the live dataset, so it matches the generated types. A fresh clone with no environment variables builds and renders every page. CI needs no secrets, which also means pull requests from forks build.

One bug only showed up in a build with no Sanity configuration. `createClient` and the image URL builder both throw an error when the project ID is empty, so a build with no configuration crashed before it ever got to the fallback. Both now get a placeholder project ID when there is no configuration. Neither `createClient` nor the image URL builder is called in that kind of build.

## The fallback was running on every build

`getPageSlugs()` feeds `generateStaticParams`, and it was written the same way as `getPage()`. It calls Sanity, catches any error, and returns the snapshot. Every build ended up in the catch block.

`sanityFetch` calls `draftMode()`. Next throws on `draftMode()` inside `generateStaticParams`, because that runs at build time with no request behind it. So the throw happened on every build, the catch block returned the snapshot, and the list of pages to prerender always came from the committed snapshot and never from the live dataset.

Every page still rendered. `dynamicParams` stays at its default of `true`, so a page created since the last snapshot still resolved on first request. It was rendered on demand every time and never prerendered, and the only signal was one line from `console.warn` in the build output.

The fix is to use the plain client for that one read. That read does not need draft mode, stega, or a cache tag, and the client is already pinned to `perspective: 'published'`.

## How the conversion was checked

Moving the copy into Sanity meant pulling the text out of every component and passing it back in as props. The markup and the CSS were supposed to come through unchanged.

- capture the DOM of the deployed build
- capture the DOM of the local build
- normalize the CSS-module hashes, which differ between builds
- diff the two

The first run reported no differences, because a `next dev` server from an earlier run still held the port the check was reading. Once that was corrected, the diff found two differences that had passed the type checker and the linter. Section headers had lost their `header` landmark, and a `position: relative` was left on every row that nothing depended on. That check, and five others that reported a pass on broken code, are in [Challenges Building the Teleport Atlas Landing Page]({% post_url 2026-07-28-challenges-building-the-teleport-atlas-landing-page %}).

## The four failures

Three of these produced no output at all. The fourth wrote a warning to the build log.

- Click-to-edit gave no warning about the missing studio URL.
- Edits saved and the preview kept showing old text, because the default refresh handler logged instead of refreshing.
- The cache served old content on a timer that looked like it was configured correctly.
- The slug list came from a committed snapshot on every build, because a `try`/`catch` swallowed a throw that happened every time.

No tool in this project's CI reports any of those. Finding them took three things.

- publishing content and watching for it to appear
- diffing the DOM against the deployed build
- reading the `next-sanity` source to find out when stega turns on and what its refresh handler does

## What the conversion required

Removing `output: 'export'` is the change the rest of the work followed from. Once the site ran on a server, draft mode worked, and every piece around it had to be set up by hand.

- a CORS origin with credentials, and no framing header, so Presentation can load the site at all
- the studio URL, so the click-to-edit overlays can resolve a field
- `resolve.ts`, so opening a document previews that document's page
- a refresh handler, so a draft edit updates the preview
- a signed webhook, so published content reaches the site
- `stegaClean()`, so the strings the code reads still match

`browserToken` stays false, which keeps the draft-read token on the server. `getPage()` and `getPageSlugs()` both fall back to a snapshot committed to the repo, which keeps the build working with no credentials. Each one writes a warning to the build log and then returns content, so the build succeeds and every page renders. That is how the slug list came from the snapshot on every build while the build still succeeded.

Content now publishes without a deploy, and the site still builds from a fresh clone with no environment variables.
