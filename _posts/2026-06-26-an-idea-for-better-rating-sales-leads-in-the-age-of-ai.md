---
layout: post
title: 'An Idea for Better Rating of Sales Leads in the Age of AI'
description: 'LLMs made spam and bot leads hard to spot with traditional filters. Here is an idea: score every sales lead on the sales side with AI checks on domain age, the website behind the email, and the person submitting it, then rank by quality so the sales team spends time where it pays off.'
date: 2026-06-26 08:44:40 CDT -0500
categories: ['Articles']
tags: ['sales', 'lead-scoring', 'ai', 'marketo', 'salesforce', 'marketing-automation', 'spam-prevention']
image: '/assets/uploads/2026/06/rating-sales-leads-in-the-age-of-ai.webp'
---

At the previous organization that I worked with, our sales team had an ongoing problem: we could never really keep spam and bots off our lead forms. The sales team would get flooded with junk submissions, and digging the real leads out of that pile ate up time we did not have. It has only gotten harder in the age of AI. The web marketing team can still catch some of it at the form, but capture-side filters can no longer tell you with any confidence whether a lead is spam. So I started thinking about what we could do further down, on the sales side. The rest of this article is a handful of ideas for marking lead quality with automated tools and a bit of AI.

This is an idea I have been chewing on for handling that: gather as many data points on a lead as possible, as fast as possible, and as automatically as possible, then collapse them into a single quality score the sales team can sort by. None of this magically produces quality leads. But more signals, graded and averaged, beat a sales rep guessing which submission to open first.

## Three signals worth automating

Every time a lead comes through the form, an AI tool can go look up a few things before a human ever sees it. Three checks do most of the work. [Enrichment tools like Clearbit, ZoomInfo, and Clay](https://pipeline.zoominfo.com/sales/lead-enrichment-tools) already pull a lot of this at form fill, but they mostly do it to fill in firmographic blanks. The twist here is using the same signals to ask a different question: is this lead even real?

### The domain behind the email

Take the email address the lead submitted and check its domain against the registry. How long has it been registered? Is it a real organization or something stood up last week? Has the domain shown up in spam or bot activity before? A domain that has existed long enough, tied to an actual company, is a basic signal that this lead is worth a look.

### The website behind the email

From that same domain, find the organization's primary website and analyze its content. What does the company actually do, and does it line up with what you sell? Paired with the domain-age check above, the content of the site helps grade whether this is a real prospect or a tire kicker.

There is a bonus here beyond the legitimacy check. The same content analysis tells you what the lead actually does, so you can have the AI tool summarize it and write that summary straight into a field in Marketo. The sales rep opens the lead already knowing the company's business, without you ever having to ask for it on the form. It keeps the form short and still hands the rep context they would otherwise have to dig up themselves.

### The person behind the email

Use the name and email to look up the individual. Do they show up in articles, on a company leadership page, on LinkedIn? A person with a findable professional footprint is a stronger lead than a name that returns nothing.

You can also cross-check the submitted email against any address publicly listed for that person, though treat this as a soft signal at best. Plenty of genuine buyers use a personal email on purpose: they are still researching and not ready to be identified, they are wary of handing their work inbox to a vendor, or they are an executive routing around an assistant who screens it. A mismatch should nudge your confidence down a little and nothing more. Requiring a work address is a good way to [throw away real opportunities](https://marketingsherpa.com/article/chart/lead-gen-business-vs-personal-email), since conversion drops sharply the moment you force it.

And keep in mind what all three of these checks actually establish: that this is a real person at a real organization. Knowing that is still a long way from knowing the lead is genuine. Someone can submit a real name and a real email, even one lifted from a company's team page, and pass every check while only meaning to bog your sales team down. Closing that gap, the bot detection, honeypots, and verification steps, and why each only raises the cost against an AI-equipped adversary, turned into its own rabbit hole, so I wrote it up separately: [Identity Is Not Legitimacy: Vetting a Sales Lead Is an Arms Race]({% post_url 2026-06-26-identity-is-not-legitimacy-vetting-a-sales-lead-is-an-arms-race %}).

## Turning signals into a score

Each of these checks gets graded, and an AI tool can do the grading. Score each one from 0 to 10, where 10 is a high-quality lead and 0 is low, then average them into a single number for the lead.

The sales team sorts their submissions by it and starts at the top, working the highest-quality leads first instead of taking them in the order they happened to arrive.

Salesforce's [Einstein Lead Scoring](https://help.salesforce.com/s/articleView?id=sf.einstein_sales_els_how_it_works.htm) and [Marketo](https://www.default.com/post/marketo-lead-scoring) already grade leads this way, but they mostly learn from your own historical conversion data to predict which leads look like past customers. This leans the other direction: outbound checks on whether the lead is genuine in the first place. Averaging a handful of plain 0 to 10 checks is also easier to reason about than a model that hands you a number without showing its work.

## What the flow looks like

The whole idea hinges on a short form and an automated back end. Roughly, it looks like this:

```text
        Visitor lands on the website
                    |
                    v
        Short lead form  (name + email + phone)
                    |
                    | submit
        +-----------+-----------+
        v                       v
   Marketo                 AI scoring service
   (capture / MAP)         -----------------------
                           1. Domain age + registry    -> score
                           2. Website content          -> score
                           3. Person / LinkedIn        -> score
                                      |
                                      | average the 3 scores
                                      v
                           Lead Quality: 0 to 10
                                      |
                                      | write to field
                                      v
                           Salesforce
                           Lead Quality column
                           (sales sorts by this)
```

Keep the form as short as possible, ideally just a name and an email, so the velocity of someone filling it out and submitting stays high. On submit, the data goes two places at once: into Marketo for normal capture, and into an AI scoring service that runs the three checks, averages them, and writes the result into a Lead Quality field in Salesforce. From there the sales team can order their queue by quality and decide what to pursue hard now versus what can wait.

## Keep the old scoring around

Do not rip out whatever spam and quality tooling you already run. Keep it in place, side by side with the new scoring, for a long enough stretch to actually compare them. The question you are answering is whether the AI scoring produces clearly better leads than the old approach, or whether the difference is small enough that the investment is not worth it. You need a baseline to compare against, and you only get one by leaving the old system running.

## This belongs on the sales side

I think these tools belong on the sales side rather than the web marketing side. The web team should still block traditional spam and bots at the form, but the scoring lives where it gets used and seen: after the lead lands in Salesforce, where the sales team has the visibility to act on it. Grading lead quality is a sales problem, so put the score where the sales team works.

## Close the loop

It cannot be one-directional. If the sales team notices patterns of spam or botting that are slowing them down, that has to flow back to the web marketing team: which addresses to block, which patterns to watch, what to add on the capture side to cut down on junk before it ever becomes a lead. Web marketing tightens the front door, sales scores what gets through, and sales reports back what it learns.

Good leads that are worth the time take effort from both sides. The scoring just makes sure that effort lands on the leads most likely to pay off.
