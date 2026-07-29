---
layout: post
title: 'Web Accessibility Standards and Law: WCAG 2.1 and 2.2, the European Accessibility Act, and US Requirements'
description: 'Which WCAG version each accessibility law names and who has to meet it, covering the European Accessibility Act, ADA Title II and III, Section 508, and California.'
date: 2026-07-24 15:14:41 CDT -0500
modified_date: 2026-07-28 02:11:06 CDT -0500
categories: ['Articles']
tags: ['accessibility', 'wcag', 'web-standards', 'ada', 'european-accessibility-act', 'section-508', 'compliance']
image: '/assets/uploads/2026/07/web-accessibility-standards-and-law-wcag-eaa-us.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<ul>
		<li><strong>WCAG is the technical standard.</strong> Each territory's law sets who has to meet it and which version. Most current laws name <strong>WCAG 2.1 Level AA</strong>. <strong>WCAG 2.2 AA</strong> is the next target.</li>
		<li><strong>US government bodies have a codified standard with deadlines.</strong> State and local governments owe WCAG 2.1 AA under ADA Title II. Federal agencies owe WCAG 2.0 AA under Section 508.</li>
		<li><strong>US private businesses have no codified web standard</strong> under ADA Title III. Enforcement runs through litigation, and courts and settlements treat WCAG 2.1 AA as the benchmark.</li>
		<li><strong>EU (EAA):</strong> covers private-sector products and services on the EU market since June 28, 2025. The technical benchmark is EN 301 549, which builds on WCAG 2.1 AA. A business outside the EU that offers a covered service to consumers in the EU is in scope.</li>
		<li><strong>US health and human services (Section 504):</strong> entities that receive HHS funding owe WCAG 2.1 AA, by May 11, 2027 or May 10, 2028 depending on employee count.</li>
		<li><strong>California:</strong> an ADA website violation is also an Unruh Act violation, which carries damages of no less than $4,000 plus attorney's fees.</li>
		<li><strong>What to do:</strong> build and maintain to WCAG 2.1 AA and plan for 2.2. The tooling and process for testing a site against these criteria is in the companion article on <a href="{% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}">testing for WCAG conformance</a>.</li>
	</ul>
</aside>

WCAG is the technical standard for web accessibility. It is published by the World Wide Web Consortium and updated on its own schedule. The laws that require accessibility are separate from it. They differ by territory, and each one names a WCAG version.

Two of those laws changed recently. The European Accessibility Act became applicable on June 28, 2025 and extended accessibility requirements to part of the private sector across the EU. In the United States, the Department of Justice finalized a rule in 2024 requiring state and local governments to meet WCAG 2.1 Level AA, and the compliance dates now fall in 2027 and 2028.

## Web Content Accessibility Guidelines (WCAG)

WCAG is published by the World Wide Web Consortium through its [Web Accessibility Initiative](https://www.w3.org/WAI/standards-guidelines/wcag/). Every law below points to it, either directly or through a regional standard.

### Conformance levels

WCAG sorts its success criteria into three levels, A, AA, and AAA.

- **Level A** is the minimum. Content that fails it is unusable for some people.
- **Level AA** is the level nearly every law adopts. It includes the criteria for color contrast, text resizing, keyboard operation, form labels, and error identification.
- **Level AAA** is the strictest. No law requires it across a whole site, because some content cannot meet all of it.

When a regulation says "WCAG 2.1 AA," it means every Level A and Level AA success criterion in that version.

### Versions: 2.0, 2.1, and 2.2

WCAG point releases are backward compatible. Meeting a later version means you also meet the earlier ones.

- **WCAG 2.0** was published on December 11, 2008.
- **WCAG 2.1** was published on June 5, 2018 and added 17 success criteria over 2.0, covering mobile, low vision, and cognitive needs.
- **WCAG 2.2** was published on October 5, 2023 and added nine success criteria over 2.1. It is also the ISO standard [ISO/IEC 40500:2025](https://www.w3.org/WAI/standards-guidelines/wcag/).

Most laws still name WCAG 2.1 AA. The EU's EN 301 549 moves to WCAG 2.2 AA in its next version, so new work should target 2.2.

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

WCAG 2.2 also removed 4.1.1 Parsing, which is now obsolete. Passing and failing markup for these criteria is in the [companion article on testing]({% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}).

## The European Accessibility Act

The European Accessibility Act (EAA) is [Directive (EU) 2019/882](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882), adopted on April 17, 2019. Member States had to publish their transposing laws by June 28, 2022 and apply them from June 28, 2025. The directive sets one set of accessibility requirements across member states so covered products and services can move within the single market.

Article 2 covers these products placed on the market after June 28, 2025:

- consumer general purpose computer hardware and the operating systems for it
- payment terminals
- ATMs, ticketing machines, check-in machines, and interactive information terminals
- consumer terminal equipment used for electronic communications services, such as smartphones
- consumer terminal equipment used to access audiovisual media services
- e-readers

It covers these services provided to consumers after June 28, 2025:

- electronic communications services
- services providing access to audiovisual media services
- websites, mobile apps, electronic tickets, and travel information for air, bus, rail, and waterborne passenger transport
- consumer banking services
- e-books and dedicated software
- e-commerce services

The [Web Accessibility Directive (EU) 2016/2102](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L2102) already covered public-sector websites and apps.

The directive defines a service provider as any natural or legal person who provides a service on the Union market or makes offers to provide such a service to consumers in the Union. It does not require the provider to be established in the EU, so a business outside the EU that sells a covered service to consumers in the EU is in scope.

The technical benchmark is the harmonized standard [EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf). The published version, V3.2.1 (2021-03), builds its web clause on WCAG 2.1, with the Level A and Level AA criteria normative and the Level AAA criteria informative. [Draft V4.1.0 (2025-11)](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.00_20/en_301549v040100ev.pdf) moves that clause to WCAG 2.2 and adds an Annex ZB mapping the standard to the requirements of Directive 2019/882. That draft ran through the ETSI approval process from November 13, 2025 to February 11, 2026, so the formal harmonized-standard citation for the EAA is still being finalized. Conforming to EN 301 549 is the accepted way to show conformity with the directive's requirements.

Three limits on the scope:

- **Microenterprises** that provide services are exempt from the service accessibility requirements. The directive defines a microenterprise as one that employs fewer than 10 people and has an annual turnover of 2 million euros or less, or an annual balance sheet total of 2 million euros or less.
- **Existing service contracts** agreed before June 28, 2025 may continue without alteration until they expire, and no longer than five years from that date, which is June 28, 2030.
- **Penalties** are set by each member state in national law. The directive only requires that they be effective, proportionate, and dissuasive, so the fines and enforcement steps vary across the EU.

## Accessibility law in the United States

There is no single US web accessibility statute. Different laws cover different entities, and they name different WCAG versions.

### ADA Title II: state and local government

In 2024 the Department of Justice finalized a rule under Title II of the Americans with Disabilities Act requiring state and local governments to make their web content and mobile apps meet [WCAG 2.1 Level AA](https://www.ada.gov/resources/2024-03-08-web-rule/). The rule was published on April 24, 2024. An [interim final rule published on April 20, 2026](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web) extended the compliance dates. Entities with a total population of 50,000 or more must comply by April 26, 2027, and entities with a total population under 50,000 and special district governments by April 26, 2028. The rule covers websites, mobile apps, and documents such as word processing files, presentations, PDFs, and spreadsheets, with exceptions for archived content, preexisting documents, and third-party posts.

The WCAG 2.1 Level AA standard is still in effect. In the [regulatory agenda it published on September 22, 2025](https://www.federalregister.gov/documents/2025/09/22/2025-18331/regulatory-agenda), the Department of Justice said it plans to publish a Notice of Proposed Rulemaking to reconsider whether some of the provisions of the April 24, 2024 rule could be made less costly. That agenda entry lists the NPRM date as "To Be Determined," and no proposed rule had been published as of this writing.

### Section 508: federal agencies

[Section 508](https://www.section508.gov/manage/laws-and-policies/) of the Rehabilitation Act covers information and communications technology that federal agencies develop, procure, maintain, or use, which in practice reaches the contractors and vendors that sell to them. The Access Board issued the Revised 508 Standards on January 18, 2017, and they went into effect on January 18, 2018. They incorporate the [Level A and Level AA success criteria and conformance requirements of WCAG 2.0](https://www.access-board.gov/ict/).

Federal agencies are therefore on WCAG 2.0 while state and local governments are on WCAG 2.1 under the Title II rule.

### Section 504: recipients of HHS funding

Section 504 of the Rehabilitation Act bars disability discrimination by programs that receive federal financial assistance. In May 2024 the Department of Health and Human Services [finalized a rule](https://www.federalregister.gov/documents/2024/05/09/2024-09237/nondiscrimination-on-the-basis-of-disability-in-programs-or-activities-receiving-federal-financial) requiring the web content and mobile apps of entities that receive HHS funding to meet the WCAG 2.1 Level A and Level AA success criteria. It was published on May 9, 2024 and took effect on July 8, 2024. An [interim final rule published on May 11, 2026](https://www.federalregister.gov/documents/2026/05/11/2026-09266/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web) extended the compliance dates. Recipients with 15 or more employees must comply by May 11, 2027, and recipients with fewer than 15 employees by May 10, 2028. The extension moved only the dates. WCAG 2.1 Level AA is still the required standard.

### ADA Title III: private accommodations

Title III of the ADA covers private businesses that are public accommodations. No regulation sets a web technical standard for them. Enforcement runs through litigation, and courts and settlements commonly treat WCAG 2.1 Level AA as the benchmark.

### California

The Unruh Civil Rights Act is [California Civil Code section 51](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=51.). It states that a violation of a person's rights under the ADA is also a violation of section 51. [Civil Code section 52](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=52.) sets damages for an Unruh violation at up to three times actual damages "but in no case less than four thousand dollars ($4,000)," plus attorney's fees the court determines.

How far the Unruh Act reaches a purely online business is limited. In [Martinez v. Cot'n Wash](https://www.courts.ca.gov/opinions/documents/B314476.PDF) (2022), the California Court of Appeal affirmed the dismissal of an Unruh claim over a retail website that was not compatible with screen reading software. The court held that under current law it could not read "place of public accommodation" in the ADA as including retail websites with no connection to a physical space, and that the discriminatory effect of a facially neutral website is not on its own a basis for inferring the intentional discrimination the Unruh Act otherwise requires. A business with a physical location in California should treat WCAG 2.1 AA as the expectation, since an ADA violation there is also an Unruh violation.

Assembly Bill 1757 in the 2023 to 2024 session would have written WCAG 2.1 AA into California law with a private right of action. It [did not pass](https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202320240AB1757). The legislature's bill status page lists it as an inactive bill that died, with a last action of "From Senate committee without further action" on November 30, 2024. Some accessibility vendors state that it took effect, which is incorrect. Liability today runs through the Unruh Act's incorporation of the ADA.

California state agencies have a separate set of obligations. [Government Code section 11135](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=11135.) requires programs that receive state funding to meet the protections and prohibitions of Section 202 of the ADA with respect to disability. [Government Code section 7405](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=7405.) requires state governmental entities, and entities that contract with state or local entities, to comply with Section 508 of the federal Rehabilitation Act. [Government Code section 11546.7](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=11546.7.), added by AB 434, requires each state agency director and chief information officer to post a signed certification on the agency's website home page, before July 1, 2019 and every two years after, that the site complies with sections 7405 and 11135 and with WCAG 2.0 or a later version at a minimum of Level AA.

## How the standards and the laws line up

| Law or rule                           | Who it covers                              | WCAG version                              | Key date                            |
| ------------------------------------- | ------------------------------------------ | ----------------------------------------- | ----------------------------------- |
| European Accessibility Act            | Private-sector products/services in the EU | 2.1 AA (via EN 301 549)                   | Applies Jun 28, 2025                |
| ADA Title II                          | US state and local government              | 2.1 AA                                    | Apr 26, 2027 / Apr 26, 2028 by size |
| Section 508                           | US federal agencies and contractors        | 2.0 AA                                    | In effect since Jan 18, 2018        |
| Section 504 (HHS)                     | Recipients of HHS federal funding          | 2.1 AA                                    | May 11, 2027 / May 10, 2028 by size |
| ADA Title III                         | US private accommodations                  | No codified standard (2.1 AA in practice) | No fixed date; litigation-driven    |
| California Unruh Act / ADA            | Businesses doing business in California    | 2.1 AA in practice                        | In effect; $4,000 minimum damages   |
| California Gov. Code 11546.7 / AB 434 | California executive-branch agencies       | 2.0 AA or later                           | Biennial certification              |

## What this means in practice

For most teams, WCAG 2.1 Level AA is the baseline to build and test against. It satisfies the EAA through EN 301 549 V3.2.1 and the Title II rule, and it is the benchmark courts apply under ADA Title III and the Unruh Act. WCAG 2.2 Level AA is the next target, since EN 301 549 V4.1.0 moves to it and meeting 2.2 also means meeting 2.1. Section 508 requires WCAG 2.0 AA, which is a subset of 2.1, so a site built to 2.1 AA already meets it.

The EAA applies based on where a service is offered, so a US site that offers a covered service to consumers in the EU is in scope with no EU presence. The Unruh Act is narrower for a purely online, out-of-state business, per Martinez v. Cot'n Wash. The compliance dates are staggered, so the deadline that applies depends on which law covers the site.

The tooling and process for testing a site against these criteria, including automated scanners, manual review, and where AI fits, is in the companion article on [Testing for WCAG Conformance]({% post_url 2026-07-24-testing-web-accessibility-tools-automation-and-ai %}).

## References

- WCAG overview, versions, and ISO/IEC 40500:2025, W3C WAI: [w3.org/WAI/standards-guidelines/wcag](https://www.w3.org/WAI/standards-guidelines/wcag/)
- What's New in WCAG 2.2, W3C WAI: [w3.org/WAI/standards-guidelines/wcag/new-in-22](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- WCAG 2.2 specification, W3C: [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/)
- European Accessibility Act, Directive (EU) 2019/882, EUR-Lex: [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882)
- EAA legislative summary, EUR-Lex: [accessibility of products and services](https://eur-lex.europa.eu/EN/legal-content/summary/accessibility-of-products-and-services.html)
- Web Accessibility Directive (EU) 2016/2102, EUR-Lex: [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L2102)
- EN 301 549 V3.2.1 (2021-03), ETSI: [en_301549v030201p.pdf](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)
- EN 301 549 draft V4.1.0 (2025-11), ETSI: [en_301549v040100ev.pdf](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.00_20/en_301549v040100ev.pdf)
- ADA Title II web rule, ada.gov: [ada.gov/resources/2024-03-08-web-rule](https://www.ada.gov/resources/2024-03-08-web-rule/)
- ADA Title II compliance date extension (Apr 20, 2026), Federal Register: [federalregister.gov](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web)
- DOJ regulatory agenda (Sep 22, 2025), entry 1190-AA82, Federal Register: [federalregister.gov](https://www.federalregister.gov/documents/2025/09/22/2025-18331/regulatory-agenda)
- Section 508 laws and policies, GSA: [section508.gov/manage/laws-and-policies](https://www.section508.gov/manage/laws-and-policies/)
- Revised 508 Standards and WCAG 2.0 Level A and AA, US Access Board: [access-board.gov/ict](https://www.access-board.gov/ict/)
- HHS Section 504 rule (May 9, 2024), Federal Register: [federalregister.gov](https://www.federalregister.gov/documents/2024/05/09/2024-09237/nondiscrimination-on-the-basis-of-disability-in-programs-or-activities-receiving-federal-financial)
- HHS Section 504 compliance date extension (May 11, 2026), Federal Register: [federalregister.gov](https://www.federalregister.gov/documents/2026/05/11/2026-09266/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web)
- Unruh Civil Rights Act, California Civil Code section 51: [leginfo.legislature.ca.gov](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=51.)
- Unruh Act damages, California Civil Code section 52: [leginfo.legislature.ca.gov](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=52.)
- California AB 1757 (2023 to 2024), official bill status (inactive bill, died): [leginfo.legislature.ca.gov](https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202320240AB1757)
- California Government Code section 11546.7 (AB 434 certification): [leginfo.legislature.ca.gov](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=11546.7.)
- Martinez v. Cot'n Wash, Inc. (2022), California Court of Appeal opinion: [courts.ca.gov](https://www.courts.ca.gov/opinions/documents/B314476.PDF)
