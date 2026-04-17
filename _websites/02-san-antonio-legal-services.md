---
title: San Antonio Legal Services Association
thumbnail: /assets/uploads/2021/07/www.sa-lsa.org_-600x400.webp
image: /assets/uploads/2021/07/www.sa-lsa.org_.webp
agency: Gray Digital Group
team:
    - name: Jim Aderhold
      role: Project Manager
    - name: Aurora Cantu
      role: Account Executive
    - name: Blake Cerecero
      role: Designer/Developer
link: https://www.sa-lsa.org/
link_text: View Live Site
---

San Antonio Legal Services Association (SALSA) organizes pro bono legal volunteers across the city, and they needed a platform that could both push training resources to volunteers and route them to available cases; without staff maintaining the same data in two admin systems.

I chose WordPress for the content layer so SALSA staff could build training landing pages themselves using familiar blocks, and put the engineering effort into the integration layer underneath. I wrote PHP to authenticate against the Volunteer Hub API and pull the three upcoming pro bono clinics and events onto the site automatically, so the homepage is always current without anyone touching it. On the case side, I used WP All Import to sync the Legal Server API into a custom post type, which turned available cases into filterable listings volunteers can browse and sign up for directly.

The net effect: Legal Server stays the single source of truth for case data, staff never re-enter it, and volunteers find both their training and their next case in one place.
