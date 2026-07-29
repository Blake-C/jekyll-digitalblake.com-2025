---
layout: post
title: 'Answering Questions Asked by a Salesperson on Lead Scoring'
description: "Answers to a salesperson's questions on AI lead scoring. What the score looks like in your CRM, whether you see low leads, and who sets the cutoff."
date: 2026-07-21 18:47:14 CDT -0500
categories: ['Articles']
tags: ['sales', 'lead-scoring', 'ai', 'salesforce', 'hubspot', 'spam-prevention']
image: '/assets/uploads/2026/07/salesperson-questions-ai-lead-scoring.webp'
---

<aside class="callout">
	<h2 class="callout__title">A note before you read</h2>
	<p>After the first two articles, a few more questions came up. Those pieces, <a href="{% post_url 2026-06-26-an-idea-for-better-rating-sales-leads-in-the-age-of-ai %}">the idea for rating sales leads</a> and <a href="{% post_url 2026-06-26-identity-is-not-legitimacy-vetting-a-sales-lead-is-an-arms-race %}">the one on identity and legitimacy</a>, were more technical and written for an engineering audience. I wanted to answer these questions and add more of my thoughts on them, for the salesperson who might be wondering how any of this would actually get implemented.</p>
</aside>

Everything below is a broad overview of what's possible. How it gets built is a conversation between the sales and engineering teams, tuned to what you sell and who you sell to. With that said, here are the questions and my answers to each.

## 1. What does the score actually look like where I work? A 0 to 100 number? Red, yellow, green? Where does it show up?

I'd assume it would be a column, just a new data point inside your platform of choice, that you can sort and filter on your own. Or if your team wanted to do a red, yellow, and green and set the thresholds on what those look like, then yeah, that sounds correct to me too. Since the earlier piece was a brain dump, I didn't really think that deeply about it. It was more of, okay, how do we get the score there in the first place?

## 2. Do I still see the low scores, or are they hidden?

You would see them. You'd want all that data to be visible to you so that you can make your own determination on who you should look into and who you shouldn't.

## 3. Why did a lead score low? Can I decide to chase the whale anyway?

Again, you'd want the score to be visible, so if you want to chase the whale anyway, you can do so. You can also use the AI tool itself to do additional checks beyond what you currently do. So it wouldn't just be, what's the domain age, and are they legitimate? It would be, who is this company? Are they a startup, perhaps? If they're a startup, can we pull in additional tools and automatically look them up in a funding database, to see if they exist there, what round they're in, and how much funding they have raised. That funding is money they have available to spend beyond just their revenue, so it tells you whether they even have the budget to use whatever service you're selling.

## 4. Can I flag a bad call, and does the system learn from it?

Yeah, I think that would be something you could build into a system like this. You'd want the ability to push back from your system, back over into whatever AI tool you're using to do the automated checks, and feed that back in so that it becomes a feedback loop that grows and learns. Exactly how that would work is a little bit beyond me at the moment. I would think you'd have to have some sort of API call when something gets checked or submitted in the platform. Say there's an empty field the salesperson can type into for the reason they're flagging it as a bad call, and on save that automatically gets pushed back over into whatever AI platform or system is recording that data. Or it could just send an email to the engineering team so they can put that input into the system, or modify it, so it can be improved.

Whether the system actually learns, or you keep losing that segment, would be up to the team itself, on a team-by-team basis. How it's implemented is very different, and would have to be worked out between the engineering and sales teams to figure out what's best for them.

## 5. How does it handle personal emails and new company buyers?

Generally, at the organizations I've worked for in the past, we blocked personal email addresses, so those wouldn't come through the lead form at all. That was specific to what I did at those previous organizations. If someone is using this on their own instance, it kind of depends on the size of organizations they are targeting, and that is how they would want to make that determination. It is not the sort of thing where there is one size fits all. Blocking personal emails might also block any startups, or anyone using Gmail, which is a huge chunk of where the spam comes from. It really depends on what your organization is selling and who your primary target audience is. Are you looking to sell to mature corporations in a B2B scenario? If so, your target audience probably has a long history with their product, email, and web domain, versus a startup. If startups are your primary audience, then you'd want that sort of block turned off. You'd want them to be able to submit from a personal email address, because that's more likely where they're setting themselves up first, before they've set up their full organization. But you also have to ask yourself: is your product something a brand-new organization is going to want to invest in that early? So it is a catch-22: opening up to personal email addresses for those smaller businesses is likely to bring in a lot more junk along with them.

## 6. How fast is the scoring? Real time on submission, or delayed?

It would be automatic. As soon as the form gets submitted, you would want the process to kick off and all the checks to run at the same time. Your lead can go straight into the CRM, whether that is HubSpot or Salesforce, without any delay, and an additional request can be working in the background to feed the results into that existing record once those checks are done. The lookups themselves are requests out to an LLM, which does the additional research and collection and then sends that back, so the write into the record goes through the HubSpot or Salesforce API rather than some separate external tool. If you are using one of the major AI tools, like Claude, ChatGPT, or Copilot, it should be a pretty fast process, I would imagine.

## 7. Will the verification step cost me hot deals? Is there evidence, or is it a bet?

There is always some risk there, but a verification step does not make those people disappear. They might come up with a lower score. What you can do is track where the verification stands. Say we sent this person a verification email, they have not done it yet, but it has been sent. That means they rank higher than the people who got fully blocked out as spam at the bottom of your list. You can still filter into those individuals to see if there are any potential whales you can target inside that list. And if you are able to somehow get that person to verify through a marketing email, maybe not even SMS, but something like an email that says, hey, come look at this website, and you get a trigger on that, that yes, they clicked on it, then you still have the ability to see that individual, keeping in mind a click alone can't fully rule out an LLM doing something in the background.

As for whether there's evidence or it's a bet: the evidence is verification on top of the identity checks, the keystone from the earlier article. That combination is where you get enough data to make a judgment call instead of guessing. Anything without some form of verification is more of a bet, because you don't have that additional data. All of this is really just finding ways to lift the most valuable leads up so you can use your own judgment to find the best targets.

## 8. Who owns the threshold, sales or engineering?

Right away, I would say it's something the engineering team would probably set up initially, so that is who would own it outright at the beginning. It would take additional work and thought to figure out how you would surface that to the sales team. For example, in Salesforce, under a profile setting for a particular salesperson, is where you could potentially add a field that says, hey, this section is what we're going to feed over into the LLM when it does its additional research for these extra fields. If you would like to modify them, this is where you'd go to do it. But that also needs to sit inside some kind of review process, so the engineering team knows what the LLM is being asked to look up. That script is critical to getting the correct answers. If you have just any other salesperson going in to make those modifications, you can end up having the LLM look into things it shouldn't, which would add time and cost to the LLM's work. It would need to be done quickly, with high velocity, so the sales team isn't waiting on the engineering team, but it shouldn't be something that takes forever to change either.

## 9. Does it integrate with my CRM, or is this another tab?

The way I thought it through, it would have to be integrated into Salesforce, HubSpot, or whatever the CRM is. That makes the most sense. I wouldn't want this to be an entirely separate system outside of what they're already using.

---

I hope the above has provided more information on what is possible, and where you need to go to have further discussions on how to implement some of these ideas. A lot of it I can't really go into detail on right now, but it should give you enough to start those conversations.
