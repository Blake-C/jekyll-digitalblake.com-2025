---
layout: post
title: 'Web Accessibility Standards and Law: WCAG 2.1 and 2.2, the European Accessibility Act, and US Requirements'
description: 'A factual reference on web accessibility in 2026: WCAG conformance levels and versions, the European Accessibility Act and EN 301 549, and the current state of US law (ADA Title II, Section 508, ADA Title III, and California).'
date: 2026-07-24 15:14:41 CDT -0500
categories: ['Articles']
tags: ['accessibility', 'wcag', 'web-standards', 'ada', 'european-accessibility-act', 'section-508', 'compliance']
image: '/assets/uploads/2026/07/web-accessibility-standards-and-law-wcag-eaa-us.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>WCAG is the standard; the law decides who has to meet it.</strong> The working target is <strong>WCAG 2.1 Level AA</strong> today, with <strong>2.2 AA</strong> as the near-future target.</li>
		<li><strong>Government and private sites are held to different things.</strong> Government bodies have an explicit, codified standard with hard deadlines (US state and local government under ADA Title II: WCAG 2.1 AA; US federal agencies under Section 508: WCAG 2.0 AA). US private businesses have no codified web standard under ADA Title III, but face real litigation exposure with WCAG 2.1 AA as the de facto benchmark. The EU is the exception: the European Accessibility Act now puts explicit requirements on much of the private sector.</li>
		<li><strong>EU (EAA):</strong> applies to private-sector products and services on the EU market since June 28, 2025; the technical benchmark is EN 301 549 (WCAG 2.1 AA). It reaches non-EU businesses that sell into the EU.</li>
		<li><strong>US health and human services (Section 504):</strong> entities that receive HHS funding owe WCAG 2.1 AA, with deadlines in May 2027 and May 2028.</li>
		<li><strong>California:</strong> the Unruh Act ties website accessibility to the ADA at $4,000 per violation, clearest for businesses with a California presence.</li>
		<li><strong>What to do:</strong> build and maintain to WCAG 2.1 AA and plan for 2.2. For how to test a site against it, see the companion article on <a href="{% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}">testing for WCAG conformance</a>.</li>
	</ul>
</aside>

There are two layers to web accessibility. One is a standard, the other is a law. The standard is the Web Content Accessibility Guidelines (WCAG), and the law differs by territory and over time. The standard is relatively stable and is updated by standards bodies, whereas the law is a moving target.

Two of those movements make 2026 a useful point to take stock. The European Accessibility Act became applicable on June 28, 2025, extending accessibility requirements to a large part of the private sector across the EU. In the United States, the Department of Justice finalized a rule in 2024 that binds state and local governments to WCAG 2.1 Level AA, with compliance dates now landing in 2027 and 2028. This article is the standards and legal reference: what applies to whom, and to which version of WCAG. The developer side, how you actually test a site against these criteria with tooling, manual review, and AI, is covered in a [companion article]({% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}).

## Web Content Accessibility Guidelines (WCAG)

WCAG is published by the World Wide Web Consortium through its [Web Accessibility Initiative](https://www.w3.org/WAI/standards-guidelines/wcag/). It is the reference every accessibility law below points to, either directly or through a regional standard.

### Conformance levels

WCAG groups its success criteria into three conformance levels:

- **Level A** is the minimum. Failing it tends to make content unusable for some people.
- **Level AA** is the level nearly every law adopts. It covers the common barriers: color contrast, text resizing, keyboard operation, form labels, and error identification.
- **Level AAA** is the strictest and is not expected as a blanket requirement, because some content cannot meet all of it.

When a regulation says "WCAG 2.1 AA," it means every Level A and Level AA success criterion in that version.

### Versions: 2.0, 2.1, and 2.2

WCAG uses point releases that are backward compatible. Meeting a later version means you also meet the earlier ones.

- **WCAG 2.0** was published on December 11, 2008.
- **WCAG 2.1** was published on June 5, 2018 and added 17 success criteria over 2.0, largely covering mobile, low vision, and cognitive needs.
- **WCAG 2.2** was published on October 5, 2023 and adds nine success criteria over 2.1. It was also adopted as the international standard ISO/IEC 40500:2025.

Most laws still cite WCAG 2.1 AA. WCAG 2.2 AA is the direction regional standards are moving toward, so it is the sensible target for new work.

### What WCAG 2.2 adds (as of October 5, 2023)

[WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) adds nine new success criteria:

- <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html" target="_blank" rel="noopener">**2.4.11 Focus Not Obscured (Minimum)**</a>, Level AA
- <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html" target="_blank" rel="noopener">**2.4.12 Focus Not Obscured (Enhanced)**</a>, Level AAA
- <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" target="_blank" rel="noopener">**2.4.13 Focus Appearance**</a>, Level AAA
- <a href="https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html" target="_blank" rel="noopener">**2.5.7 Dragging Movements**</a>, Level AA
- <a href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" target="_blank" rel="noopener">**2.5.8 Target Size (Minimum)**</a>, Level AA
- <a href="https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html" target="_blank" rel="noopener">**3.2.6 Consistent Help**</a>, Level A
- <a href="https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html" target="_blank" rel="noopener">**3.3.7 Redundant Entry**</a>, Level A
- <a href="https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html" target="_blank" rel="noopener">**3.3.8 Accessible Authentication (Minimum)**</a>, Level AA
- <a href="https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html" target="_blank" rel="noopener">**3.3.9 Accessible Authentication (Enhanced)**</a>, Level AAA

WCAG 2.2 also removed the old 4.1.1 Parsing criterion, which is now obsolete. For what these criteria look like in code, with passing and failing examples, see the [companion article on testing]({% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}).

## The European Accessibility Act

The European Accessibility Act (EAA) is [Directive (EU) 2019/882](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882), adopted on April 17, 2019. It became applicable on June 28, 2025. Its purpose is to harmonize accessibility requirements across member states so that covered products and services move freely within the single market.

The [scope](https://eur-lex.europa.eu/EN/legal-content/summary/accessibility-of-products-and-services.html) reaches a defined set of private-sector products and services: computers and operating systems, smartphones, payment terminals and self-service machines such as ATMs and ticketing kiosks, e-commerce, consumer banking, electronic communications, e-books, and elements of passenger transport services. The EAA complements the earlier [Web Accessibility Directive (EU) 2016/2102](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L2102), which already covered public-sector websites and apps.

The obligation follows the market where a product or service is sold. A business established outside the EU that places a covered product or service on the EU market falls within scope.

The technical benchmark is the harmonized standard [EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf). Its published version, V3.2.1 (2021-03), incorporates WCAG 2.1 Level AA for web content. A [draft V4.1.0 (2025-11)](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.00_20/en_301549v040100ev.pdf) moves the standard toward WCAG 2.2 Level AA. Conforming to EN 301 549 is the accepted way to show conformity with the directive's requirements, with the formal harmonized-standard citation for the EAA still being finalized through the V4.x revision. It is the practical thing to build against.

A few boundaries matter for planning:

- **Microenterprises** that provide services and have fewer than 10 employees and annual turnover under 2 million euros are exempt from the service obligations.
- **Existing service contracts** agreed before June 28, 2025 may continue until they expire, and no later than June 28, 2030.
- **Penalties** are set by each member state in national law, so the specific fines and enforcement steps vary across the EU.

## Accessibility law in the United States

There is no single US web accessibility statute. Different laws cover different entities, and they reference different WCAG versions.

### ADA Title II: state and local government

In 2024 the Department of Justice finalized a rule under Title II of the Americans with Disabilities Act requiring state and local governments to make their web content and mobile apps conform to [WCAG 2.1 Level AA](https://www.ada.gov/resources/2024-03-08-web-rule/). The rule was published on April 24, 2024. Compliance dates depend on population, and an [April 2026 interim final rule](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web) set them as follows: entities serving 50,000 or more people must comply by April 26, 2027, and smaller entities and special districts by April 26, 2028. The scope is broad, covering websites, mobile apps, online forms, documents, and third-party platforms used to deliver government services.

The rule and its WCAG 2.1 Level AA standard remain in effect. The current administration's DOJ has not rescinded it; its actions so far are the deadline extension above and a September 2025 regulatory notice signaling a possible future rulemaking to revisit some requirements. No such proposed rule had been published as of this writing, so WCAG 2.1 Level AA is still the operative standard.

### Section 508: federal agencies

[Section 508](https://www.section508.gov/) of the Rehabilitation Act covers information and communications technology that federal agencies develop, procure, maintain, or use, which in practice reaches the contractors and vendors that sell to them. The Revised 508 Standards incorporate WCAG 2.0 Level AA and have been in effect since January 18, 2018. This leaves a version gap: federal agencies sit on WCAG 2.0 while the newer Title II rule for state and local government uses WCAG 2.1. A refresh toward a newer WCAG version has been discussed but is not yet adopted.

### Section 504: recipients of HHS funding

Section 504 of the Rehabilitation Act bars disability discrimination by programs that receive federal financial assistance. In May 2024 the Department of Health and Human Services [finalized a rule](https://www.federalregister.gov/documents/2024/05/09/2024-09237/nondiscrimination-on-the-basis-of-disability-in-programs-or-activities-receiving-federal-financial) setting WCAG 2.1 Level AA as the standard for the web content and mobile apps of entities that receive HHS funding, which reaches most hospitals, health centers, physician practices, and human services programs. The rule took effect July 8, 2024. After a 2026 extension, recipients with 15 or more employees must comply by May 11, 2027, and smaller recipients by May 11, 2028. The extension moved only the dates; WCAG 2.1 Level AA remains the required standard.

### ADA Title III: private accommodations

Title III of the ADA covers private businesses that are public accommodations. There is no regulation setting a specific web technical standard for them. Enforcement runs through litigation, and courts and settlements commonly treat WCAG 2.1 Level AA as the practical benchmark. For a private business, the absence of a codified standard does not remove the exposure.

### California

California adds real teeth for private businesses through the Unruh Civil Rights Act (California Civil Code section 51), which incorporates the ADA. An ADA website violation is therefore also an Unruh violation, and Unruh carries statutory damages of 4,000 dollars per violation plus attorney fees. The exposure is clearest for a business with a physical presence or other nexus in California. How far it reaches a purely online, out-of-state business is unsettled: in [Martinez v. Cot'n Wash](https://www.courts.ca.gov/opinions/documents/B314476.PDF) (2022), the California Court of Appeal held that a website-only business with no physical location is not a place of public accommodation under the ADA, and so not liable under the Unruh Act, bringing California in line with the Ninth Circuit. That question is still up in the air, but a business with any California footprint should treat WCAG 2.1 AA as the expectation.

A proposed bill, AB 1757 (2023 to 2024 session), would have written WCAG 2.1 AA into California law with a private right of action. It [did not pass](https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202320240AB1757); the official legislative record lists it as an inactive bill that died in committee. Some accessibility vendors state that it took effect; that is incorrect. Liability today still flows through the Unruh Act's incorporation of the ADA.

For California state agencies, a separate framework applies. Government Code sections 11135 and 7405 set nondiscrimination and ICT accessibility obligations tied historically to Section 508, and Government Code section 11546.7 (from AB 434) requires executive-branch agencies to certify, on a signed biennial certification, that their sites conform to WCAG 2.0 Level AA or later.

## How the standards and the laws line up

| Law or rule                           | Who it covers                              | WCAG version                              | Key date                            |
| ------------------------------------- | ------------------------------------------ | ----------------------------------------- | ----------------------------------- |
| European Accessibility Act            | Private-sector products/services in the EU | 2.1 AA (via EN 301 549)                   | Applies Jun 28, 2025                |
| ADA Title II                          | US state and local government              | 2.1 AA                                    | Apr 26, 2027 / Apr 26, 2028 by size |
| Section 508                           | US federal agencies and contractors        | 2.0 AA                                    | In effect since Jan 18, 2018        |
| Section 504 (HHS)                     | Recipients of HHS federal funding          | 2.1 AA                                    | May 11, 2027 / May 11, 2028 by size |
| ADA Title III                         | US private accommodations                  | No codified standard (2.1 AA in practice) | No fixed date; litigation-driven    |
| California Unruh Act / ADA            | Businesses doing business in California    | 2.1 AA in practice                        | In effect; $4,000 per violation     |
| California Gov. Code 11546.7 / AB 434 | California executive-branch agencies       | 2.0 AA or later                           | Biennial certification              |

The table above is your reference guide for where things stand today.

## What this means in practice

For most teams, WCAG 2.1 Level AA is the baseline to build and test against. It satisfies the EAA through EN 301 549 and the US Title II rule today, and it is the practical benchmark courts apply under ADA Title III and the Unruh Act. WCAG 2.2 Level AA is the forward-looking target, since EN 301 549 is moving to it and meeting 2.2 also meets 2.1. Section 508's WCAG 2.0 requirement is the one exception, and it is a subset of 2.1, so a site built to 2.1 AA already covers it.

Two practical notes. The EAA reaches a business through where it sells, so a US site serving EU customers is in scope even with no physical presence in the EU; California's Unruh Act is narrower for purely online, out-of-state businesses, as noted above. The compliance dates are staggered, so the relevant deadline depends on which law applies to the specific site.

Regardless of which legal jurisdiction applies to you, the target standard is the same in most cases. How you actually reach it, the tooling, automated testing, manual review, and where AI now fits, is the subject of the companion article: [Testing for WCAG Conformance]({% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}).

## References

- WCAG overview and conformance levels, W3C WAI: [w3.org/WAI/standards-guidelines/wcag](https://www.w3.org/WAI/standards-guidelines/wcag/)
- What's New in WCAG 2.2, W3C WAI: [w3.org/WAI/standards-guidelines/wcag/new-in-22](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- WCAG 2.2 specification, W3C: [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/)
- European Accessibility Act, Directive (EU) 2019/882, EUR-Lex: [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882)
- EAA legislative summary, EUR-Lex: [accessibility of products and services](https://eur-lex.europa.eu/EN/legal-content/summary/accessibility-of-products-and-services.html)
- Web Accessibility Directive (EU) 2016/2102, EUR-Lex: [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L2102)
- EN 301 549 V3.2.1 (2021-03), ETSI: [en_301549v030201p.pdf](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)
- EN 301 549 draft V4.1.0 (2025-11), ETSI: [en_301549v040100ev.pdf](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.00_20/en_301549v040100ev.pdf)
- ADA Title II web rule, ada.gov: [ada.gov/resources/2024-03-08-web-rule](https://www.ada.gov/resources/2024-03-08-web-rule/)
- Section 508, GSA: [section508.gov](https://www.section508.gov/)
- HHS Section 504 rule (May 9, 2024), Federal Register: [federalregister.gov](https://www.federalregister.gov/documents/2024/05/09/2024-09237/nondiscrimination-on-the-basis-of-disability-in-programs-or-activities-receiving-federal-financial)
- Unruh Civil Rights Act, California Civil Code section 51: [leginfo.legislature.ca.gov](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=51.)
- California AB 1757 (2023 to 2024), official bill status (died in committee): [leginfo.legislature.ca.gov](https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202320240AB1757)
- Martinez v. Cot'n Wash, Inc. (2022), California Court of Appeal opinion: [courts.ca.gov](https://www.courts.ca.gov/opinions/documents/B314476.PDF)
