---
layout: post
title: 'Identity Is Not Legitimacy: Vetting a Sales Lead Is an Arms Race'
description: 'Identity checks can tell you a sales lead is a real person at a real company. They cannot tell you the lead is genuine. Here is why every layer that tries to prove legitimacy, from bot detection and honeypots to email and SMS verification, only raises the cost against an AI-equipped adversary instead of stopping them.'
date: 2026-06-26 10:32:00 CDT -0500
modified_date: 2026-07-04 12:50:32 CDT -0500
categories: ['Articles']
tags:
    [
        'sales',
        'lead-scoring',
        'spam-prevention',
        'bot-detection',
        'ai',
        'honeypot',
        'prompt-injection',
        'sms-verification',
    ]
image: '/assets/uploads/2026/06/identity-is-not-legitimacy.webp'
---

<aside class="post-tldr">
	<h2 class="post-tldr__title">TL;DR</h2>
	<p>This article is the conclusion to my earlier research on verifying the identity of a user who submits a lead form. In it, I lay out the bigger picture and show that the identity stage is just one section of it. As we broaden out, we find our keystone: the combination of identity and verification. Several more methods act as signals that feed into the lead quality score, so the sales team has a better picture of who they need to focus on.</p>
</aside>

In a companion piece I laid out [an idea for rating sales leads by identity]({% post_url 2026-06-26-an-idea-for-better-rating-sales-leads-in-the-age-of-ai %}): check the domain, the website, and the person behind the email, score each, and rank the real leads above the junk. However, that's not the whole story. To zoom out further, you really need to do a comparison of identity against the legitimacy of the submission.

A lead can show up with a real name and a real email, even one lifted straight off a company's team page, and pass every identity check while only meaning to bog your sales team down. The checks confirm the data is real. They say nothing about whether the submission is genuine. Once I started pulling that thread, every clever fix I came up with did the same frustrating thing. It made the attack more expensive without ever shutting it down. What follows is my attempt to track the current state of lead legitimacy.

## What you can do at the form, and why AI erodes it

### Capture-side bot checks help, mostly against traditional bots

The standard toolkit still has value: a honeypot field, form-fill timing, behavioral scoring like reCAPTCHA v3 or Cloudflare Turnstile, IP reputation and submission velocity. A well-built honeypot field reportedly catches the large majority of dumb bots at zero cost to the user, and pairing it with a timing check pushes that higher ([OpenReplay](https://blog.openreplay.com/honeypot-fields-stop-bots/), [WorkOS](https://workos.com/blog/stop-bots-with-honeypots)). Those are vendor estimates rather than peer-reviewed numbers, but the shape is right. Keep these on.

The problem is what they assume. They assume the bot is in a hurry and behaves like a script. An AI agent can take its time, move a mouse on a natural-looking path, and spoof a browser fingerprint well enough to score as human, which is why people now describe behavioral CAPTCHA as losing ground ([UNU](https://c3.unu.edu/blog/captchas-losing-ground-to-ai), [BroadChannel](https://broadchannel.org/ai-breaks-captcha-human-verification-3-0/)). These checks earn their keep against the cheap, high-volume bots. A motivated adversary with AI walks right past them.

### A cleverer, AI-era honeypot

This next trick was my favorite, until I read up on it. Instead of a math question any AI solves instantly, hide a field that asks a complex, unrelated natural-language question a human will never see. A bot parsing the page may answer it and out itself, especially if you also watch the clock: a person cannot read and answer a hidden question in under two seconds, but an LLM agent does.

This is real and tested, just not novel. It is essentially Palisade Research's [LLM Agent Honeypot](https://arxiv.org/abs/2410.13919), which combines prompt-injection traps with response-time analysis and, over a few months, fingerprinted live AI agents out of millions of attempts. Cloudflare's [AI Labyrinth](https://blog.cloudflare.com/ai-labyrinth/) industrializes the hidden-link version of the same idea. The honest limit is the one you would guess: hardened agents already filter out fields with suspicious styling and skip them, and a [2025 paper on LLMs polluting online research](https://arxiv.org/pdf/2508.01390) recommends prompt injections only as hidden honeypot questions for exactly that reason. All it really buys you is a higher cost to the attacker.

One trap to avoid: do not scatter hidden "stop" instructions across your visible page to shoo AI away. Modern models increasingly treat hidden injected text as inert, and search engines read hidden-text-that-differs-from-what-users-see as classic black-hat cloaking and penalize it ([Search Engine Land](https://searchengineland.com/hidden-prompt-injection-black-hat-trick-ai-outgrew-462331), [Auth0](https://auth0.com/blog/prompt-injection-ai-browser/)). Keep this to a single honeypot field on the form and keep it off your content pages.

### The accessibility tension, the same arms race in miniature

This part has a real irony to it. A field that is only hidden visually is still announced to screen readers, which both hurts assistive-technology users and risks a false positive if one fills it. The accessible fix is the standard one: `aria-hidden="true"` plus `tabindex="-1"` and `autocomplete="off"`, with a realistic field name and off-screen CSS instead of `display:none` ([FormShield](https://formshield.dev/blog/form-honeypot-implementation-guide), [CSS-Tricks](https://css-tricks.com/building-a-honeypot-field-that-works/)).

But those very attributes are the fingerprint a DOM-aware bot uses to recognize the honeypot and skip it. The reason it generalizes: a modern bot emulates a real browser and reads the same accessibility and visibility semantics a screen reader does. The honest affordance that tells assistive tech "skip this" is the same signal that tells a sophisticated agent "skip this." You cannot be correct for one without flagging yourself to the other. What still carries weight is the timing check and varied, realistic field names. The hiding itself does almost none of the work.

## Why a verification step doesn't settle it

### Email verification falls to AI

The intuitive next move is to make the lead confirm they are who they say. Send a confirmation email, or a marketing email engineered to get them to click. It feels like proof a human is on the other end, and a few years ago it was. That stopped being true once there was infrastructure that gives an AI agent its own inbox specifically so it can receive that email, parse the link or code, and complete the flow on its own ([AgentMail](https://www.agentmail.to/blog/email-as-identity-for-ai-agents), [OpenMail](https://openmail.sh/email-verification-api)). Double opt-in was built to filter automation, and agents now walk straight through it.

### Phone and SMS is a stronger indicator, but a gate that backfires

A phone number is harder to come by than an email, though not by much. Disposable and virtual numbers, "rented" tenured numbers, and SIM farms all exist, and commoditized OTP bots read the code out of the text and submit it for you ([Authgear](https://www.authgear.com/post/otp-bots-bypass-sms-2fa/), [Stytch](https://stytch.com/blog/otp-bots/)). The low-friction way to use a phone number is passively: look up its line type and country and reject out-of-region or non-fixed VoIP numbers like Google Voice before you ever send anything, then make only the suspicious submissions do an actual code step so you do not crater conversion on real buyers ([Twilio Lookup](https://www.twilio.com/en-us/blog/filter-voip-before-otp-verification)).

Treat a passed code as a soft positive that the person controls a real, in-region number. Do not let it harden into a throw-it-out gate. It adds friction, an AI can complete it, and worst of all it opens a brand-new attack surface: SMS pumping, also called toll fraud, where bots feed your form premium-rate numbers they control and run up your messaging bill, with one cut going to them. It is a real and expensive problem; Twitter reportedly lost around 60 million dollars a year to it before cutting SMS two-factor entirely ([Twilio](https://www.twilio.com/en-us/blog/sms-pumping-fraud-solutions), [Group-IB](https://www.group-ib.com/blog/sms-pumping/)). The step you added to stop spam becomes a thing spammers exploit to cost you money.

## The one place the layers reinforce each other

One move actually pays off, and it only works because of the companion article. Identity and verification are each easy to fool on their own. Stack them together and they get much harder to beat. Identity alone proves a matching real person appears to exist, but anyone can type that name and email. Verification alone proves the submitter controls some inbox or number, but it could be a throwaway they own. The intersection is the part that is genuinely hard to fake: passing both means controlling the actual contact method of a real person whose public footprint, their LinkedIn, the company site, the role the domain implies, corroborates them. That is close to actually being them.

So gate it. Use the identity score from the [companion piece]({% post_url 2026-06-26-an-idea-for-better-rating-sales-leads-in-the-age-of-ai %}) as the trigger, and only spend a verification step on leads that already clear the identity threshold. You get two things for that. A verification pass is only meaningful once identity says the person looks real and corroborated. And gating the send closes off the SMS-pumping problem from the last section, because a bot spraying premium-rate numbers never reaches the send, since it never clears identity in the first place.

None of this is a new invention, to be clear. It is [risk-based step-up verification](https://www.businessscreen.com/resources/top-10-identity-verification-companies-buyers-guide), where you only spend the expensive check on cases that warrant it, plus the [cross-reference-everything logic](https://oscilar.com/blog/kyc-fraud-detection) that fraud and KYC teams have leaned on for years to catch synthetic identities, and it is productized by the likes of Prove and Entrust. The mechanism is borrowed wholesale. The only fresh part is pointing it at sales-lead scoring and using the identity score itself as the gate.

I will not oversell it. It does nothing for the legitimate buyer using a personal email, who has no corporate footprint to match against. And a determined actor who genuinely controls a matching person's inbox, including that real person deciding to waste your time, still passes. Call it the keystone, the strongest single signal you can assemble, and leave it there. It will still let some bad leads through.

## The leading edge

Everything above is solid current practice, but it is not where the front of this has moved. Detection itself got much better. [Device intelligence at billion-device scale](https://www.businesswire.com/news/home/20260224743088/en/Fingerprint-Reports-65-ARR-Growth-Surpasses-1-Billion-Device-Identifications-Per-Month-as-Enterprises-Adopt-Device-Intelligence-to-Combat-AI-Driven-Fraud) now ships with explicit authorized-AI-agent detection, and [behavioral biometrics](https://www.backbase.com/blog/ai-fraud-detection-banking) ask a sharper question than any honeypot can: do you move like a real person, in your typing cadence and mouse path? Paired with [persistent device fingerprinting](https://www.sardine.ai/blog/device-fingerprinting), these catch coordinated abuse that sails past an OTP. But notice they are still guessing from behavior, which is the exact game the rest of this article says you slowly lose.

The real shift is to stop guessing and ask for a signature. [Web Bot Auth](https://www.biometricupdate.com/202603/vendors-race-to-build-identity-stack-for-agentic-ai), an IETF draft built on signed HTTP requests, has an agent prove its identity with a published cryptographic key instead of leaving you to infer it, so a site can allow, rate-limit, or deny per identity rather than per guess. It is already backed by Cloudflare, Akamai, [Amazon's agent browser](https://aws.amazon.com/blogs/machine-learning/reduce-captchas-for-ai-agents-browsing-the-web-with-web-bot-auth-preview-in-amazon-bedrock-agentcore-browser/), and Google, which shipped a dedicated Google-Agent identity in March 2026. Running alongside it, proof-of-personhood and ["know your agent" work](https://www.vouched.id/learn/blog/how-to-detect-ai-agent) bind an agent back to an accountable, verified human. The whole question flips from "human or bot?" to "which verified human is this agent acting for, and is it allowed to do this?"

I will be honest about the limit. This is mostly draft and preview in mid-2026, and it does nothing for an anonymous spammer who simply will not present a signature on your public lead form. But it is the first approach that stops depending on out-detecting an adversary who keeps getting better. If this arms race has a durable exit, it runs through verifiable identity. A cleverer trap will not get you there.

## The arms race as a scoring pipeline

No single layer blocks a determined adversary, and that is the point. Stack them and each one contributes a signal, and those signals roll up into one number the sales team can sort by, the same way the identity checks did in the companion piece. Nothing here hard-rejects except the obvious traditional bots. A determined human or AI still gets a number, just a low one, while a real buyer floats to the top.

<figure class="post-diagram">
{% include diagrams/lead-legitimacy-pipeline.svg %}
</figure>

The gate matters: spending the verification step only on leads that already clear the identity threshold is what keeps the SMS-pumping attack surface closed and keeps friction off real buyers. Everything else just nudges the score up or down.

## Where that leaves us

Identity is the part you can actually deliver. Legitimacy is an arms race that never fully resolves. Anything you can verify at the exact moment of submission can be faked or auto-completed by an adversary with AI, and the more I dug, the more every "gotcha" turned into a toll booth the determined ones simply pay.

The signals that hold up are the ones that are expensive to fake at scale and that play out over time. Matching the email to an aged, reputable company domain, because spinning up a website takes an afternoon and building a credible history takes years. Genuine engagement after the fact: real opens, return visits, an actual reply and a conversation. And human judgment on the leads that sit on the line. None of those are instant, which is exactly why they are harder to spoof.

So rank your real leads with the identity checks, keep the traditional-bot defenses on for what they do catch, and accept that proving good-faith intent is something you manage over time. The form is the wrong place to expect a final answer. If you want the upstream half of this, scoring and ranking the leads that are real, that is the [companion article]({% post_url 2026-06-26-an-idea-for-better-rating-sales-leads-in-the-age-of-ai %}).

## References

Bot detection, honeypots, and CAPTCHA decay:

- [Honeypot Fields 101: Stop Bots Without CAPTCHAs](https://blog.openreplay.com/honeypot-fields-stop-bots/) (OpenReplay)
- [How to stop bots with honeypots](https://workos.com/blog/stop-bots-with-honeypots) (WorkOS)
- [Form Honeypot Fields: Implementation Guide and Best Practices](https://formshield.dev/blog/form-honeypot-implementation-guide) (FormShield)
- [Building a Honeypot Field That Works](https://css-tricks.com/building-a-honeypot-field-that-works/) (CSS-Tricks)
- [Why CAPTCHAs Are Losing Ground to AI](https://c3.unu.edu/blog/captchas-losing-ground-to-ai) (UNU)
- [AI Has Officially Broken CAPTCHA](https://broadchannel.org/ai-breaks-captcha-human-verification-3-0/) (BroadChannel)

Prompt-injection honeypots and hidden-prompt cloaking:

- [LLM Agent Honeypot: Monitoring AI Hacking Agents in the Wild](https://arxiv.org/abs/2410.13919) (Palisade Research, arXiv)
- [Recognising, Anticipating, and Mitigating LLM Pollution of Online Behavioural Research](https://arxiv.org/pdf/2508.01390) (arXiv)
- [Trapping misbehaving bots in an AI Labyrinth](https://blog.cloudflare.com/ai-labyrinth/) (Cloudflare)
- [Hidden prompt injection: the black hat trick AI outgrew](https://searchengineland.com/hidden-prompt-injection-black-hat-trick-ai-outgrew-462331) (Search Engine Land)
- [Hiding Prompts in Plain Sight: A New AI Security Risk](https://auth0.com/blog/prompt-injection-ai-browser/) (Auth0)

Email verification defeated by agents:

- [Email as Identity for AI Agents](https://www.agentmail.to/blog/email-as-identity-for-ai-agents) (AgentMail)
- [Email Verification API for AI Agents](https://openmail.sh/email-verification-api) (OpenMail)

Phone and SMS verification, line-type filtering, and SMS pumping:

- [How OTP Bots Bypass SMS 2FA](https://www.authgear.com/post/otp-bots-bypass-sms-2fa/) (Authgear)
- [One-Time Password (OTP) bots: what they are and how to stop them](https://stytch.com/blog/otp-bots/) (Stytch)
- [How to filter out VoIP numbers before sending an SMS OTP](https://www.twilio.com/en-us/blog/filter-voip-before-otp-verification) (Twilio)
- [What Is SMS Pumping Fraud and How to Stop It](https://www.twilio.com/en-us/blog/sms-pumping-fraud-solutions) (Twilio)
- [SMS Pumping: How Criminals Turn Your Messaging Service into Their Cash Machine](https://www.group-ib.com/blog/sms-pumping/) (Group-IB)

Risk-based verification and the leading edge:

- [Which identity verification methods deliver highest completion rates](https://www.businessscreen.com/resources/top-10-identity-verification-companies-buyers-guide) (Business Screen / Pedowitz)
- [KYC Fraud Detection: A Comprehensive Primer](https://oscilar.com/blog/kyc-fraud-detection) (Oscilar)
- [Introducing the Prove Identity Platform](https://www.prove.com/blog/introducing-identity-platform) (Prove)
- [Fingerprint Surpasses 1 Billion Device Identifications Per Month](https://www.businesswire.com/news/home/20260224743088/en/Fingerprint-Reports-65-ARR-Growth-Surpasses-1-Billion-Device-Identifications-Per-Month-as-Enterprises-Adopt-Device-Intelligence-to-Combat-AI-Driven-Fraud) (BusinessWire)
- [Device Fingerprinting for Fraud and ATO Prevention](https://www.sardine.ai/blog/device-fingerprinting) (Sardine)
- [5 AI fraud detection techniques in banking](https://www.backbase.com/blog/ai-fraud-detection-banking) (Backbase)
- [Vendors race to build identity stack for Agentic AI](https://www.biometricupdate.com/202603/vendors-race-to-build-identity-stack-for-agentic-ai) (Biometric Update)
- [Reduce CAPTCHAs for AI agents with Web Bot Auth](https://aws.amazon.com/blogs/machine-learning/reduce-captchas-for-ai-agents-browsing-the-web-with-web-bot-auth-preview-in-amazon-bedrock-agentcore-browser/) (AWS)
- [Introducing HUMAN Verified AI Agent](https://www.humansecurity.com/learn/blog/human-verified-ai-agent-open-source/) (HUMAN Security)
- [How to Detect AI Agent vs Human: A 2026 Guide](https://www.vouched.id/learn/blog/how-to-detect-ai-agent) (Vouched)
