---
layout: case-study
featured: false
order: 10
permalink: /case-studies/ok-tours/
title: OK Tours!!!
description: 'A Sitefinity CMS site for a regional bus tour operator, featuring a custom jQuery calendar, mobile-first design, and a social stream integration that helped drive a measurable increase in tours booked.'
thumbnail: /assets/uploads/2025/05/ok-tours-thumbnail.webp
image: /assets/uploads/2025/05/ok-tours-home-page.webp
hero_image: /assets/uploads/2025/05/ok-tours-hero.webp
og_image: /assets/uploads/2025/05/ok-tours-og.webp
agency: Gray Digital Group
team:
    - name: Jiles Rodriguez
      role: Team Lead
    - name: Josephine Medel
      role: Designer
    - name: Aurora Ramirez
      role: Account Executive
    - name: Richard Baugh
      role: Production Director
    - name: Blake Cerecero
      role: Developer
link: 'https://web.archive.org/web/20180422232323/http://www.oktours.com/'
link_text: View Archived Site
tech:
    - Sitefinity
    - jQuery
    - SVG
    - SCSS
    - Mobile-First
---

OK Tours is a regional bus tour operator running trips across the US, from day casino runs to multi-night destination packages. The site was built at Gray Digital Group with a mobile-first design, using Sitefinity as the CMS. Tours were structured in Sitefinity as reusable templates with configurable days, nights, and dates, so a new departure for an existing destination was added by filling out a form, with no new page to build. Sitefinity's built-in caching was turned on for the site.

Josephine Medel gave the header two tabs at the top of the page, one for navigation and one for contact numbers, which together made the header look like the front grille of a bus. On the left side of the header, a questionnaire used select lists to walk users through what kind of trip they were looking for and show matching tours. A charter bus quote button sat below the questionnaire. On the right side of the header was the custom calendar.

I wrote the calendar from scratch in jQuery. Past dates were greyed out, and dates from today forward were rendered in color. Any date with a scheduled tour got an icon, one for casino bus trips and one for standard tours, both SVG so they stayed sharp at any size, and clicking one linked to the tour detail page for that date. The calendar supported month-by-month and year-by-year navigation, and it placed the first and last days of each month in the right spot in the grid. The tour icon data came from the tours stored in Sitefinity. We never reused the calendar component on another project, but it was a satisfying feature to build custom for OK Tours.

Below the header, the homepage had a row of quick links for pickup locations, book your tour, fleet information, and newsletter signup. Below that were sections for upcoming standard tours and upcoming casino tours, each linking out to their destination pages. The lower section of the page had three columns holding a testimonial pull, a fleet information block, and a stay-connected panel. The stay-connected panel used a jQuery social stream plugin to pull posts from the client's Facebook and Twitter accounts and scroll through them automatically. This was 2015, before those platforms required substantial authentication to access feed data. Below that was the footer with site links, the company address, and logos.

![OK Tours bus tours destination carousel page](/assets/uploads/2025/05/ok-tours-bus-tours-page.webp)

The bus tours section opened with a scrolling carousel of featured destinations including Vegas, California, and Disney World, and each destination had its own location page. Those pages used a split-header layout, where the left panel held a photo gallery that could be expanded to fill the full width of the page and collapsed back into its half of the header. The right panel showed the location name, trip details, and a book-your-tour link. Below the split header, the left column held pricing, a full itinerary, and detailed descriptions of each itinerary item, with another book CTA at the bottom. The right sidebar held quick links for chartering a bus and finding a nearby pickup location, a list of upcoming trips for that destination, a testimonial, and the social stream again.

![OK Tours calendar page with departure dates and tour icons by destination](/assets/uploads/2025/05/ok-tours-calendar-page.webp)

![OK Tours casino bus trips listing page](/assets/uploads/2025/05/ok-tours-casino-bus-trip-page.webp)

The casino bus trips page listed upcoming trips with links into the same location-page format used for standard tours. The calendar page gave users a top-level view of all departure dates across destinations, each row showing the location name, a banner image, and icons indicating whether the trip was a casino run or a standard tour. New Orleans, Disney World, Las Vegas, New York, Kinder, Eagle Pass, and other locations all appeared there. The same questionnaire from the homepage header was repeated at the top of the calendar page.

![OK Tours contact page using Sitefinity's built-in forms component](/assets/uploads/2025/05/ok-tours-contact-page.webp)

The fleet page covered the 56-passenger motor coach lineup with a photo gallery and an embedded YouTube video. About Us was copy only, and Travel Tips was a standalone informational page. The contact form was built on Sitefinity's native forms component, keeping form handling inside the CMS without a third-party dependency.

Jiles Rodriguez was the team lead for this project, while I was the developer, and Josephine Medel the designer. We all worked very closely on this project, and I think it was a great success for us and a template that we used moving forward on how to work as a team on these types of projects.

**Impact:** After launch the client told us they were booking more tours. The calendar on the homepage was the piece I was most proud of shipping.
