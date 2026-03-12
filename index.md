---
layout: base
title: Home
permalink: /
body_class: "home wp-singular page-template-default page wp-theme-wp-foundation-six"
description: "I Am A Front-end Web Developer - Blake Cerecero"
---

<section class="intro">
		<div class="row align-center align-middle">
			<div class="medium-6 small-12 medium-order-2 columns">
				<picture>
					<source srcset="/assets/images/profile-2022-v3.webp"
						type="image/webp">

    				<img loading="lazy" width="245" height="245" class="profile-image" alt=""
    					src="/assets/images/profile-2022-v3.webp" />
    			</picture>

    			<div class="profile-name">
    				<p>Blake Cerecero</p>
    			</div>
    		</div>

    		<div class="medium-6 small-12 medium-order-1 columns">
    			<h1 class="title">
    				<span class="line-1">I Am A</span>
    				<span class="line-2">Front-end Web</span>
    				<span class="line-3">Developer</span>
    			</h1>

    			<p>Lets work Together</p>
    		</div>
    	</div>
    </section>

<section class="github" id="projects">
		<h2 class="github__title">GitHub Projects</h2>

    	<div class=" row small-up-1 medium-up-2 large-up-3">

    		<div class="column">
    			<div class="git-project">
    				<h3 class="git-project__title">WP Foundation Six</h3>
    				<p><strong>Description<br></strong>WordPress Development Theme Framework using Foundation 6 for
    					Sites</p>

    				<p><strong>Language<br></strong>PHP</p>

    				<div class="wp-block-buttons">
    					<div class="wp-block-button"><a class="button"
    							href="https://github.com/Blake-C/wp-foundation-six" target="_blank"
    							rel="noreferrer noopener">View Project</a></div>
    				</div>
    			</div>
    		</div>

    		<div class="column">
    			<div class="git-project">
    				<h3 class="git-project__title">Youtube Playlist Module</h3>
    				<p><strong>Description<br></strong>A browser based javascript module using the YouTube API to
    					display youtube playlists with a custom UI.</p>

    				<p><strong>Language</strong><br>JavaScript</p>

    				<div class="wp-block-buttons">
    					<div class="wp-block-button"><a class="button"
    							href="https://github.com/Blake-C/youtube-playlist-module" target="_blank"
    							rel="noreferrer noopener">View Project</a></div>
    				</div>
    			</div>
    		</div>

    		<div class="column">
    			<div class="git-project">
    				<h3 class="git-project__title">Mobile Mega Menu</h3>
    				<p><strong>Description</strong><br>The mobile mega menu is designed to allow for deep menu
    					structures to be navigated easily on mobile devices.</p>

    				<p><strong>Language</strong><br>JavaScript</p>

    				<div class="wp-block-buttons">
    					<div class="wp-block-button"><a class="button"
    							href="https://github.com/Blake-C/mobile-mega-menu" target="_blank"
    							rel="noreferrer noopener">View Project</a></div>
    				</div>
    			</div>
    		</div>
    	</div>
    </section>

<section class="sites-gallery">
		<h2 class="sites-gallery__title">Websites</h2>

    	<div class="row">

    		<div class="large-4 medium-6 small-12 columns">
    			<a data-micromodal-trigger="modal-502" class="sites-gallery__button js_sites-gallery__button" href="">
    				<h3 class="sites-gallery__item-title">Republic Ranches</h3>

    				<img loading="lazy" width="600" height="400" class="sites-gallery__image wp-post-image" alt=""
    					decoding="async" fetchpriority="high"
    					src="/assets/uploads/2021/12/republicranches.com_-600x400.webp" />
    			</a>

    			<div class="modal micromodal-slide" id="modal-502" aria-hidden="true">
    				<div class="modal__overlay" tabindex="-1" data-micromodal-close>
    					<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-502-title">
    						<div class="modal__content" role="dialog" aria-modal="true"
    							aria-labelledby="modal-502-title">
    							<header>
    								<h4 class="modal__title" id="modal-502-title">
    									Republic Ranches </h4>

    								<button class="modal__close" aria-label="Close modal"
    									data-micromodal-close></button>
    							</header>

    							<div id="modal-502-content">
    								<p>Republic Ranches helps buyers and sellers of land assets primarily in the state
    									of Texas but has properties all around the United States. This build was very
    									fun and interesting from a development perspective. Our goal was to build an
    									easy to use, easy to search, and intuitive discovery process for users of the
    									new site with a focus on digital marketing and SEO. To this end we built a site
    									that hits all the marks for the use of schema data to help with search results
    									and page structure to make it easier for search engines to index different pages
    									depending on what users were searching for.</p>

    								<p>We modified the WordPress URL structure so that our breadcrumbs follow the
    									location structure of properties being listed on the site. For instance when you
    									land on a property in Bexar County, Texas the user can easily navigate back up
    									the site tree to see all properties in Bexar County and then up even further to
    									the state of Texas, and finally back to the global property search.</p>

    								<p>On the property landing pages we heavily used the real estate schema to markup
    									the data so that Google could pull out relevant data such as property name,
    									location, assets, and attributes. We also utilized CSS grid to layout the
    									property page so that users could focus on the property description while also
    									having easy access to the property assets such as galleries, brochures, maps,
    									and associates. On mobile the sidebar, with jump links, appears right after the
    									property description making it easy to scroll down to exactly what the user
    									wants to see. For the main gallery at the top of the property page we make it
    									easy for users to either scroll through the main listing or open a modal window
    									with all the images in one view for quick glances.</p>

    								<p>By far the most complex part of this build was the property search page with an
    									interactive map. We utilized the Google Maps API in conjunction with the
    									property location data to make it very fun to filter, search, and zoom around a
    									map with all unsold properties. As users zoom in on the page the listing to the
    									right will automatically filter down to only the properties within view of the
    									user. This makes sure all properties get some highlight as users move around the
    									map. If a user clicks away and then comes back to the map the state of the page
    									will be retained allowing the user to pick up where they left off. Then of
    									course users might just want to scroll down a vertical list so they have a grid
    									option to hide the map and just see the full list of properties but also still
    									filter them down if they want to see one area.</p>

    								<p class="has-text-align-center"><strong>Worked on while at<br></strong>Gray Digital
    									Group</p>

    								<p class="has-text-align-center"><strong>Team</strong><br>Jim Aderhold (Project
    									Manager)<br>Aurora Cantu (Account Executive)<br>Blake Cerecero
    									(Designer/Developer)</p>

    								<div class="wp-block-buttons is-content-justification-center">
    									<div class="wp-block-button"><a class="button primary"
    											href="https://republicranches.com/" target="_blank"
    											rel="noreferrer noopener">View Live Site</a></div>
    								</div>
    								<img loading="lazy" width="934" height="2560"
    									class="attachment-full size-full wp-post-image" alt="" decoding="async"
    									srcset="/assets/uploads/2021/12/republicranches.com_-scaled.webp 934w, /assets/uploads/2021/12/republicranches.com_-109x300.webp 109w, /assets/uploads/2021/12/republicranches.com_-374x1024.webp 374w, /assets/uploads/2021/12/republicranches.com_-768x2105.webp 768w, /assets/uploads/2021/12/republicranches.com_-560x1536.webp 560w, /assets/uploads/2021/12/republicranches.com_-747x2048.webp 747w"
    									sizes="(max-width: 934px) 100vw, 934px"
    									src="/assets/uploads/2021/12/republicranches.com_-scaled.webp" />
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>

    		</div>

    		<div class="large-4 medium-6 small-12 columns">
    			<a data-micromodal-trigger="modal-481" class="sites-gallery__button js_sites-gallery__button" href="">
    				<h3 class="sites-gallery__item-title">San Antonio Legal Services Association</h3>

    				<img loading="lazy" width="600" height="400" class="sites-gallery__image wp-post-image" alt=""
    					decoding="async" src="/assets/uploads/2021/07/www.sa-lsa.org_-600x400.webp" />
    			</a>

    			<div class="modal micromodal-slide" id="modal-481" aria-hidden="true">
    				<div class="modal__overlay" tabindex="-1" data-micromodal-close>
    					<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-481-title">
    						<div class="modal__content" role="dialog" aria-modal="true"
    							aria-labelledby="modal-481-title">
    							<header>
    								<h4 class="modal__title" id="modal-481-title">
    									San Antonio Legal Services Association </h4>

    								<button class="modal__close" aria-label="Close modal"
    									data-micromodal-close></button>
    							</header>

    							<div id="modal-481-content">
    								<p>Organizing legal volunteers to help our local community, San Antonio Legal
    									Services Association (SALSA) needed an easy to use platform that would allow
    									them to create custom landing pages to share training resources with legal
    									volunteers. To this end we chose WordPress as the go to content management
    									system with much flexibility and easy to use blocks that would allow SALSA to
    									quickly build out landing pages.</p>

    								<p>Alongside sharing volunteer resources we integrated two APIs. Volunteer Hub is a
    									service where legal volunteers could search for new pro bono opportunities and
    									we are using PHP to authenticate the API to generate a list of the three
    									upcoming clinics and events. Then we are using WP All Import to pull in data
    									from the Legal Server API where available cases are being integrated into a
    									custom post type with custom filtering. This allows legal volunteers to easily
    									sign up for or show their interest in helping those in need</p>

    								<p class="has-text-align-center"><strong>Worked on while at<br></strong>Gray Digital
    									Group</p>

    								<p class="has-text-align-center"><strong>Team</strong><br>Jim Aderhold (Project
    									Manager)<br>Aurora Cantu (Account Executive)<br>Blake Cerecero
    									(Designer/Developer)</p>

    								<div class="wp-block-buttons is-content-justification-center">
    									<div class="wp-block-button"><a class="button primary"
    											href="https://www.sa-lsa.org/" target="_blank"
    											rel="noreferrer noopener">View Live Site</a></div>
    								</div>
    								<img loading="lazy" width="900" height="2496"
    									class="attachment-full size-full wp-post-image" alt="" decoding="async"
    									srcset="/assets/uploads/2021/07/www.sa-lsa.org_.webp 900w, /assets/uploads/2021/07/www.sa-lsa.org_-108x300.webp 108w, /assets/uploads/2021/07/www.sa-lsa.org_-369x1024.webp 369w, /assets/uploads/2021/07/www.sa-lsa.org_-768x2130.webp 768w, /assets/uploads/2021/07/www.sa-lsa.org_-554x1536.webp 554w, /assets/uploads/2021/07/www.sa-lsa.org_-738x2048.webp 738w"
    									sizes="(max-width: 900px) 100vw, 900px"
    									src="/assets/uploads/2021/07/www.sa-lsa.org_.webp" />
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>

    		</div>

    		<div class="large-4 medium-6 small-12 columns">
    			<a data-micromodal-trigger="modal-478" class="sites-gallery__button js_sites-gallery__button" href="">
    				<h3 class="sites-gallery__item-title">Covenant Physician Partners</h3>

    				<img loading="lazy" width="600" height="400" class="sites-gallery__image wp-post-image" alt=""
    					decoding="async"
    					src="/assets/uploads/2021/07/covenantphysicianpartners.com_-600x400.webp" />
    			</a>

    			<div class="modal micromodal-slide" id="modal-478" aria-hidden="true">
    				<div class="modal__overlay" tabindex="-1" data-micromodal-close>
    					<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-478-title">
    						<div class="modal__content" role="dialog" aria-modal="true"
    							aria-labelledby="modal-478-title">
    							<header>
    								<h4 class="modal__title" id="modal-478-title">
    									Covenant Physician Partners </h4>

    								<button class="modal__close" aria-label="Close modal"
    									data-micromodal-close></button>
    							</header>

    							<div id="modal-478-content">
    								<p class="has-text-align-center">Empowering Physicians to live out their mission,
    									Covenant Physician Partners is built on the WordPress content management system
    									using our advanced development theme. Custom programming using ES6, Babel, and
    									Webpack allows us to program to the latest standard then transpile our code for
    									multiple browsers for interactive SVG maps for searching and filtering physician
    									practice locations. Utilizing Advanced Custom Fields we created custom Gutenberg
    									Blocks that can be used to filter out data from the custom post types for
    									practice location and physician data.</p>

    								<p class="has-text-align-center"><strong>Worked on while at<br></strong>Gray Digital
    									Group</p>

    								<p class="has-text-align-center"><strong>Team</strong><br>Jim Aderhold (Account
    									Executive)<br>Richard Baugh (Production Director)<br>Blake Cerecero
    									(Developer)<br>Tim Layton (Programmer)</p>

    								<div class="wp-block-buttons is-content-justification-center">
    									<div class="wp-block-button"><a class="button primary"
    											href="https://web.archive.org/web/20200902015029/https://covenantphysicianpartners.com/"
    											target="_blank" rel="noreferrer noopener">View Archived Site</a></div>
    								</div>
    								<img loading="lazy" width="900" height="1453"
    									class="attachment-full size-full wp-post-image" alt="" decoding="async"
    									srcset="/assets/uploads/2021/07/covenantphysicianpartners.com_.webp 900w, /assets/uploads/2021/07/covenantphysicianpartners.com_-186x300.webp 186w, /assets/uploads/2021/07/covenantphysicianpartners.com_-634x1024.webp 634w, /assets/uploads/2021/07/covenantphysicianpartners.com_-768x1240.webp 768w"
    									sizes="(max-width: 900px) 100vw, 900px"
    									src="/assets/uploads/2021/07/covenantphysicianpartners.com_.webp" />
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>

    		</div>

    		<div class="large-4 medium-6 small-12 columns">
    			<a data-micromodal-trigger="modal-445" class="sites-gallery__button js_sites-gallery__button" href="">
    				<h3 class="sites-gallery__item-title">Touch Point Media</h3>

    				<img loading="lazy" width="600" height="400" class="sites-gallery__image wp-post-image" alt=""
    					decoding="async" src="/assets/uploads/2021/07/touchpoint.health_-600x400.webp" />
    			</a>

    			<div class="modal micromodal-slide" id="modal-445" aria-hidden="true">
    				<div class="modal__overlay" tabindex="-1" data-micromodal-close>
    					<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-445-title">
    						<div class="modal__content" role="dialog" aria-modal="true"
    							aria-labelledby="modal-445-title">
    							<header>
    								<h4 class="modal__title" id="modal-445-title">
    									Touch Point Media </h4>

    								<button class="modal__close" aria-label="Close modal"
    									data-micromodal-close></button>
    							</header>

    							<div id="modal-445-content">
    								<p class="has-text-align-center">This WordPress website hosts Podcasts being pulled
    									in from Podbean. Initially starting out with a single podcast, it has expanded
    									to more than 5 shows. Some of the primary features of this site is the use of
    									custom post types to organize shows with detail pages for the shows connected to
    									listing pages for the podcasts. Very little work has to be done to create a new
    									show and start loading it up with episodes then relate hosts, social streams,
    									and ads.</p>

    								<p class="has-text-align-center"><strong>Worked on while at<br></strong>Gray Digital
    									Group</p>

    								<p class="has-text-align-center"><strong>Team</strong><br>Richard Baugh (Production
    									Director)<br>Jim Aderhold (Project Manager)<br>Josephine Medel
    									(Designer)<br>Blake Cerecero (Developer)</p>

    								<div class="wp-block-buttons is-content-justification-center">
    									<div class="wp-block-button"><a class="button primary"
    											href="http://touchpoint.health/" target="_blank"
    											rel="noreferrer noopener">View Live Site</a></div>
    								</div>
    								<img loading="lazy" width="959" height="2560"
    									class="attachment-full size-full wp-post-image" alt="" decoding="async"
    									srcset="/assets/uploads/2021/07/touchpoint.health_-scaled.webp 959w, /assets/uploads/2021/07/touchpoint.health_-112x300.webp 112w, /assets/uploads/2021/07/touchpoint.health_-384x1024.webp 384w, /assets/uploads/2021/07/touchpoint.health_-768x2050.webp 768w, /assets/uploads/2021/07/touchpoint.health_-767x2048.webp 767w"
    									sizes="(max-width: 959px) 100vw, 959px"
    									src="/assets/uploads/2021/07/touchpoint.health_-scaled.webp" />
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>

    		</div>

    		<div class="large-4 medium-6 small-12 columns">
    			<a data-micromodal-trigger="modal-458" class="sites-gallery__button js_sites-gallery__button" href="">
    				<h3 class="sites-gallery__item-title">Be Something Amazing</h3>

    				<img loading="lazy" width="600" height="400" class="sites-gallery__image wp-post-image" alt=""
    					decoding="async" src="/assets/uploads/2021/07/besomethingamazing.com_-600x400.webp" />
    			</a>

    			<div class="modal micromodal-slide" id="modal-458" aria-hidden="true">
    				<div class="modal__overlay" tabindex="-1" data-micromodal-close>
    					<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-458-title">
    						<div class="modal__content" role="dialog" aria-modal="true"
    							aria-labelledby="modal-458-title">
    							<header>
    								<h4 class="modal__title" id="modal-458-title">
    									Be Something Amazing </h4>

    								<button class="modal__close" aria-label="Close modal"
    									data-micromodal-close></button>
    							</header>

    							<div id="modal-458-content">
    								<p class="has-text-align-center">It's not everyday that I get to design a site,
    									however, this re-skin of the Be Something Amazing Drupal 7 site was an
    									opportunity to flex those muscles. The main feature of this site is the career
    									finder page where I used the Drupal API to call a custom content types data on
    									to the page for filtering by the Mixitup JavaScript plugin. On the home page our
    									editor spliced together a looping video to bring the site to life.</p>

    								<p class="has-text-align-center"><strong>Worked on while at<br></strong>Gray Digital
    									Group</p>

    								<p class="has-text-align-center"><strong>Team</strong><br>Richard Baugh (Production
    									Director)<br>Blake Cerecero (Designer/Developer)</p>

    								<div class="wp-block-buttons is-content-justification-center">
    									<div class="wp-block-button"><a class="button primary"
    											href="https://web.archive.org/web/20201126100255/https://besomethingamazing.com/"
    											target="_blank" rel="noreferrer noopener">View Archived Site</a></div>
    								</div>
    								<img loading="lazy" width="664" height="2560"
    									class="attachment-full size-full wp-post-image" alt="" decoding="async"
    									srcset="/assets/uploads/2021/07/besomethingamazing.com_-scaled.webp 664w, /assets/uploads/2021/07/besomethingamazing.com_-78x300.webp 78w, /assets/uploads/2021/07/besomethingamazing.com_-768x2962.webp 768w, /assets/uploads/2021/07/besomethingamazing.com_-531x2048.webp 531w"
    									sizes="(max-width: 664px) 100vw, 664px"
    									src="/assets/uploads/2021/07/besomethingamazing.com_-scaled.webp" />
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>

    		</div>

    		<div class="large-4 medium-6 small-12 columns">
    			<a data-micromodal-trigger="modal-450" class="sites-gallery__button js_sites-gallery__button" href="">
    				<h3 class="sites-gallery__item-title">Southwest National Primate Research Center</h3>

    				<img loading="lazy" width="600" height="400" class="sites-gallery__image wp-post-image" alt=""
    					decoding="async" src="/assets/uploads/2021/07/snprc.org_-600x400.webp" />
    			</a>

    			<div class="modal micromodal-slide" id="modal-450" aria-hidden="true">
    				<div class="modal__overlay" tabindex="-1" data-micromodal-close>
    					<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-450-title">
    						<div class="modal__content" role="dialog" aria-modal="true"
    							aria-labelledby="modal-450-title">
    							<header>
    								<h4 class="modal__title" id="modal-450-title">
    									Southwest National Primate Research Center </h4>

    								<button class="modal__close" aria-label="Close modal"
    									data-micromodal-close></button>
    							</header>

    							<div id="modal-450-content">
    								<p class="has-text-align-center">The Southwest National Primate Research Center is a
    									WordPress website and sister website to the Texas BioMedical Research Institute.
    									With a design much more fitting of my personal tastes, I used SVG icons and
    									logos to maintain a sharp feel regardless of the resolution of the users
    									display. The design is largely based off of Texas BioMed, however there are
    									several scientist pages where we did not want to duplicate data between the two
    									sites. For this reason we used the WordPress API to call in data from the main
    									Texas BioMed site into SNPRC so that our client would only need to enter the
    									data into one location.</p>

    								<p class="has-text-align-center"><strong>Worked on while at<br></strong>Gray Digital
    									Group</p>

    								<p class="has-text-align-center"><strong>Team</strong><br>Richard Baugh (Production
    									Director)<br>Nicole Sellers (Project Manager)<br>Jessica Donovan (Account
    									Executive)<br>Blake Cerecero (Developer)</p>

    								<div class="wp-block-buttons is-content-justification-center">
    									<div class="wp-block-button"><a class="button primary" href="https://snprc.org/"
    											target="_blank" rel="noreferrer noopener">View Live Site</a></div>
    								</div>
    								<img loading="lazy" width="1615" height="2022"
    									class="attachment-full size-full wp-post-image" alt="" decoding="async"
    									srcset="/assets/uploads/2021/07/snprc.org_.webp 1615w, /assets/uploads/2021/07/snprc.org_-240x300.webp 240w, /assets/uploads/2021/07/snprc.org_-818x1024.webp 818w, /assets/uploads/2021/07/snprc.org_-768x962.webp 768w, /assets/uploads/2021/07/snprc.org_-1227x1536.webp 1227w"
    									sizes="(max-width: 1615px) 100vw, 1615px"
    									src="/assets/uploads/2021/07/snprc.org_.webp" />
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>

    		</div>
    	</div>
    </section>
