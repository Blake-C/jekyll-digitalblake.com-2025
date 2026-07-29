---
layout: post
title: 'Rating Sales Leads with AI Checks on Domain and Identity'
description: 'An idea for scoring sales leads with AI checks on the email domain, the site behind it, and the person who submitted it, averaged into one score.'
date: 2026-06-26 08:44:40 CDT -0500
modified_date: 2026-07-21 18:47:14 CDT -0500
categories: ['Articles']
tags: ['sales', 'lead-scoring', 'ai', 'marketo', 'salesforce', 'marketing-automation', 'spam-prevention']
image: '/assets/uploads/2026/06/rating-sales-leads-in-the-age-of-ai.webp'
---

<aside class="callout">
	<h2 class="callout__title">TL;DR</h2>
	<p>There are three checks that can put better quality leads in front of the sales team. Check the domain behind the email address, check the content of the website on that domain, and check whether the person who submitted the form exists elsewhere on the internet, like LinkedIn or other social media. Together, these checks give the sales team signals about who submitted the form. Each check gets a score from 0 to 10, and the average lands in Salesforce for the sales team to sort by.</p>
</aside>

At the previous organization that I worked with, we could never keep spam and bots off our lead forms. The sales team got a lot of junk submissions, and finding the real leads among them took time we did not have. It has only gotten harder in the age of AI. The web marketing team can still catch some of it at the form, but capture-side filters can no longer tell you with any confidence whether a lead is spam. So I started thinking about what we could do further down, on the sales side.

The idea I have been chewing on is to gather data points on a lead:

- as many as possible
- as fast as possible
- as automatically as possible

Those data points then get collapsed into a single quality score the sales team can sort by. None of this magically produces quality leads. But more signals, graded and averaged, beat a sales rep guessing which submission to open first.

## Three signals worth automating

Every time a lead comes through the form, an AI tool can go look up a few things before a human sees it. [Enrichment tools like Clearbit, ZoomInfo, and Clay](https://pipeline.zoominfo.com/sales/lead-enrichment-tools) already pull data like this, and they use it to pre-fill known fields so the form can be shorter. The three checks below use the same data to grade whether a real person at a real company submitted the lead.

### The domain behind the email

Take the email address the lead submitted and check its domain against the registry. How long has it been registered? Is it a real organization or something stood up last week? Has the domain shown up in spam or bot activity before? A domain that has existed long enough, tied to an actual company, is a basic signal that this lead is worth a look.

### The website behind the email

From that same domain, find the organization's primary website and analyze its content. What does the company actually do, and does it line up with what you sell? Paired with the domain-age check above, the content of the site helps grade whether this is a real prospect or a tire kicker.

The same content analysis tells you what the lead actually does, so you can have the AI tool summarize it and write that summary straight into a field in Marketo. The sales rep opens the lead already knowing the company's business, without you having to ask for it on the form. The form stays short, and the rep still gets information they would otherwise have to look up.

### The person behind the email

Use the name and email to look up the individual. Do they show up in articles, on a company leadership page, on LinkedIn? A person you can find in those places is a stronger lead than a name that returns nothing.

You can also cross-check the submitted email against any address publicly listed for that person, though treat this as a soft signal at best. Plenty of genuine buyers use a personal email on purpose:

- they are still researching and not ready to be identified
- they do not want to give their work inbox to a vendor
- they are an executive routing around an assistant who screens their mail

A mismatch should nudge your confidence down a little and nothing more. Requiring a work address throws away real opportunities. MarketingSherpa reports that, on average, [55% of professionals use their personal email address to download long-form content](https://marketingsherpa.com/article/chart/lead-gen-business-vs-personal-email).

All three of these checks point to the same thing, that a real person at a real organization is behind the form. Knowing that is still a long way from knowing the lead is genuine. Someone can submit a real name and a real email, even one lifted from a company's team page, and pass every check while only meaning to bog your sales team down. Bot detection, honeypots, and verification steps, and why each one only raises the cost against an AI-equipped adversary, turned into its own rabbit hole, so I wrote it up separately in [Bot Detection, Honeypots, and SMS Checks on Sales Leads]({% post_url 2026-06-26-identity-is-not-legitimacy-vetting-a-sales-lead-is-an-arms-race %}).

## Turning signals into a score

Each of these checks gets graded, and an AI tool can do the grading. Score each one from 0 to 10, where 10 is a high-quality lead and 0 is low, then average them into a single number for the lead.

The sales team sorts their submissions by that score and works the highest-quality leads first, rather than in the order the leads arrived.

Salesforce and Marketo already grade leads, but on different data. [Einstein Lead Scoring](https://help.salesforce.com/s/articleView?id=ai.einstein_sales_els_how_it_works.htm&language=en_US&type=5) analyzes your past converted leads to find your conversion patterns, then scores each current lead on how much it has in common with the leads that converted before. Marketo adds up point values you assign to demographic traits, like industry and company size, and to tracked behavior, like a demo request or a white paper download. That description comes from a [scoring model walkthrough](https://experienceleague.adobe.com/en/docs/experiences-by-you/implementing-new-instance/building-person-scoring-model) on Adobe's documentation site, written by Marketo Engage Champions rather than by Adobe, so treat it as community documentation and not a product spec. The scoring described here runs outbound checks on whether the lead is genuine. Averaging a handful of plain 0 to 10 checks is also easier to reason about than a single model score.

## What the flow looks like

The idea needs a short form and an automated back end.

<figure class="post-diagram">
{% include diagrams/lead-scoring-flow.svg %}
</figure>

Keep the form as short as possible, ideally just a name and an email, so it stays quick to fill out and submit. On submit, the data goes two places at once:

- into Marketo for normal capture
- into an AI scoring service that runs the three checks, averages them, and writes the result into a Lead Quality field in Salesforce, which is a custom field your engineering team creates so the score has somewhere to go

From there the sales team can order their queue by quality and decide what to pursue hard now versus what can wait.

## Keep the old scoring around

Do not rip out whatever spam and quality tooling you already run. Keep it in place, side by side with the new scoring, for a long enough stretch to actually compare them. The question you are answering is whether the AI scoring produces clearly better leads than the old approach, or whether the difference is small enough that the investment is not worth it. You only get a baseline to compare against by leaving the old system running.

## This belongs on the sales side

I think these tools belong on the sales side rather than the web marketing side. The web team should still block traditional spam and bots at the form. The scoring belongs after the lead reaches Salesforce, where the sales team can see it and act on it.

## Send what sales learns back to web marketing

The scoring cannot run in one direction only. If the sales team notices patterns of spam or botting that are slowing them down, they have to report it back to the web marketing team:

- which addresses to block
- which patterns to watch
- what to add on the capture side to cut down on junk before it becomes a lead

Getting leads that are worth the time takes work from both teams. The scoring puts that work on the leads most likely to pay off.

I answered questions from a salesperson about how this would work in practice in [answering questions asked by a salesperson on lead scoring]({% post_url 2026-07-21-answering-questions-asked-by-a-salesperson-on-lead-scoring %}).
