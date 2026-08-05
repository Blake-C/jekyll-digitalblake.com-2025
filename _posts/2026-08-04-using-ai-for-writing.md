---
layout: post
title: 'A Better Way to Use LLMs for Writing'
description: 'After experimenting with several articles on writing with LLMs, I came up with what I feel is a better way to use LLMs without losing your voice.'
date: 2026-08-04 04:53:05 CDT -0500
categories: ['Articles']
tags: ['llm', 'writing', 'speech-to-text', 'dictation', 'claude-code', 'editing']
image: '/assets/uploads/2026/08/using-ai-for-writing.webp'
---

Over the past two months, I've been experimenting with using AI to help write and edit articles in an attempt to find the best path to using AI to create output that I would be happy with.

The thing I hate most about almost anything that's written out by an LLM is that there's a pattern, and everyone's recognized it. It is very annoying and pervasive in a lot of writing that you see online today. So, in my experimentation:

1. If I give the LLM a prompt, what does its writing style look like?
2. If I write part of the content, then ask the LLM to fill it in, how does it do?
3. Can we build upon existing content and improve it while maintaining the integrity of the piece?

Number three is where I feel like I've landed in using the LLM as a critic and reviewer of an article and allowing it to bring up additional questions and to challenge you on what you've stated so that you can then answer those questions in your own voice and work them into your text.

## How each scenario works

If you want the worst possible output, it's to have the LLM just generate all the text for you, after giving it very minimal information. When you don't provide enough information, enough details, the LLM is left up to its own devices to come up with the entire article. At that point, it's just guessing, and you gotta remember: an LLM picks each succeeding word by sampling from a list of probabilities, so the same input can give you very different outputs.

The second option, which is slightly better, is to dictate a good chunk of the article and then ask it to fill in any missing parts. Depending on how much you give it, the LLM can flesh out your thoughts, but it's once again predicting what should be in those spots rather than you telling it what it should be doing. That's where a lot of those AI tells listed below will slip their way into your article.

The third option, which is what the rest of this article is about, gets you the best output. And when I say output, I mean the article itself, while still being able to use an LLM as your editor, as your critic, as your proofreader. That's what I think is the correct way to be using these tools versus scenarios one and two.

So let's get this part out of the way. Here are the patterns as of this writing that are most common in AI-generated text:

- **The em dash.** The most obvious, and it shows up two or three times a paragraph. "The build passed — and nothing was tested."
- **The clever closer.** A section ends on a line that sounds like a closing argument instead of a fact. "A settable speed is a speed that can outrun reading."
- **The framing sentence.** A sentence whose only job is to tell you the next sentence is coming. "That split is deliberate." "The tradeoff is real." "The pattern is worth naming."
- **The rule of three.** Three items in a row for rhythm, where the third one is the punchline. "The build succeeds, the page looks right, and nothing was tested."
- **Not this, but that.** A contrast used as a rhythm device. "It's not just faster, it's a different way of working." "This is a survey, not a build guide."

I see these all over the place on LinkedIn, dev websites, documentation, commit messages, pull requests. It is pervasive and it's never-ending. It's easy to tell, easy to see, and very annoying. And it's one of the things I've been, in my experimentation, trying to fight against the most. I have 25 identified patterns, and in general, there's nothing wrong with these. The problem is that they just repeat constantly. _Like the lists I've added to this paragraph._

And you can always start up a session and say, hey, write in this manner. Don't do X, Y, and Z. However, that's only going to get you so far. If you want to build upon that and still use the LLM for some writing and some experimentation, you can create skills for yourself that can pivot the LLM to write in a particular manner, but it's still going to work in those mannerisms that are tells for when AI is being used in the text. It's not something you can get rid of completely, depending on the way in which you use the tool.

## The use of skills in writing with AI

For example, on my own end, I've created two skills. One is a plain-prose skill and the other is an article interview skill. The plain-prose skill is where I've gone through and created statements for how the LLM has written something and given examples of how I would state it instead or cut it entirely. And I have 22 sets of these in an examples.md file, a growing list, each one a sentence the LLM wrote sitting next to the way I would have said it. But even then, I still see constant patterns that the LLM likes to use.

## LLMs and the path of least resistance

A good example of this is when I was trying to use my plain-prose skill to articulate my thoughts into an article about modifications to a code base integrating Sanity CMS. And it constantly tried to shoehorn in the phrase "hand-written" or "by hand." Even though I've told it not to use particular patterns, it'll find ways around it to still get to what it wants to do versus how you want it phrased. This is a clear indication of the weights in the models pushing towards a particular direction and finding loopholes versus just saying something straight out the way a human would.

## The interview skill

The interview skill is the better approach to take. When I invoke it I can type up or dictate an article and then have the LLM look over my article and come up with additional questions. I do this to come up with more thoughts and ideas, alongside asking it to be critical of the thing that I just wrote to make sure there are no flaws in whatever it is that I'm saying. And I think combining this with a speech-to-text application makes it an incredibly powerful tool to write out an article more quickly.

An example of the interview skill use case is if I hand over a code base that I want to write up an article about, the LLM can go through, read my challenges.md file and the other parts of the code base, and then ask me stuff like what was the initial idea behind this project and why did you want to do it? And there are easy questions like that you can ask, but then it can also get more deep into how you've built something and what that had in terms of impact for the rest of the application. I can then go through those questions, either type them up or dictate them into the answers, so I can get the thoughts out of my head. I can then structure those answers into an article with the assistance of an LLM.

The questions themselves ought to be tailored for whatever project or topic you're discussing. The more important part is the rules you give the LLM to start interviewing you on the topic. An example of a few of the rules that I would use are:

- Only ask what I am the only source for. If the repo answers it, cut it. If the git log answers it, cut it.
- One thing per question. A question with two halves gets one answer covering the first half, so split it and use both numbers.
- Never yes or no, and never multiple choice. I'm dictating, and a question that can be answered in a word will be.
- Ask for the reason next to the decision, so the question carries the thing I did and asks why I did it.
- Ask about the sequence rather than the summary. What broke first, and what I did about it, in the order it happened.
- Ask about the failures, because what I tried that didn't work is the part no repo records. The approach I abandoned was never committed.
- Name the file or the commit in the question. An abstract question gets an abstract answer.

The last two make the difference between getting a question that is something more like: "Where does the settings profile live?" and a question that digs deeper like: "You moved the settings profile into `.config/docker/` instead of leaving it at the repo root, what made you move it?" This teases out more of the reasons for _why_ something happened versus a purely factual statement on _what_ happened.

Coming at it from the opposite direction, there's a set of questions I never want asked, because the answer will be shallow. The ones I told it not to ask:

- Anything asking for a story or a journey. I'll answer in narrative arc with scene setting and a build to a reveal, because that's what the question asked for.
- Anything asking what mattered most, or for the biggest lesson. That's significance ranking, and it comes back out in editing.
- Anything asking how I felt about it. The answer is a judgment with no fact under it, and it's harder to cut than the LLM's own filler because it's genuinely my own.
- Anything asking me to characterize the project. "What's the big idea here?" produces framing sentences.
- Anything that leads. "Was the settings profile the hard part?" plants the answer. Ask which part took the longest instead.

You can use these example rules to create your own interview skill tailored for your own process. My plain-prose skill isn't worth sharing as that's personal, whereas the interview skill isn't about the questions themselves, it's about how the questions are asked and how they're designed to get quality answers.

When the vast majority of the article is dictated in your own text, you can avoid those AI tells that are patterns working their way into your articles. You still have to keep a watchful eye out for them because if you're using the LLM to edit your text, to correct grammar, punctuation, and to be an editor to help you stitch different ideas together, you have to review it.

On the point of using an LLM to stitch your ideas together, I also find it useful to come back around and just restate those stitching points in your own words to bring them together more concisely in a way that you would say it, not just letting that stitching stay in place.

In fact, I'm using this very process for this article.

## The process that I found works best

Now what I can do is start up a draft file and start dictating my text either line by line or paragraph by paragraph. I wouldn't try to do it all at one time. It'll garble all the paragraphs into one giant piece of text, and then you have to go through and break it apart. Just do it paragraph by paragraph, think about your thoughts, think about how you would say it, and then dictate it onto the screen. The important thing here to remember also is that when you're dictating the text, it's not going to be like when you're writing it by hand. You're going to have a habit of wanting to be verbose, which is what we always do when we talk. So try to think about how you would type it instead.

Then once you have your text dictated onto the screen, you can then turn to the LLM to review it. Some of what's in this list I have built into my interview skill, where the LLM will tease out additional questions based on what I've already written or a code base I've pointed the LLM at. But in general, this is what I go through:

- Check the ordering of the paragraphs and the ideas behind them to make sure that they are clear and concise.
- Be critical of the content and come up with other thoughts that you might have missed. Not just that, "oh, the LLM likes my writing," but truly have it be critical about the thing you just wrote, even if it has to be mean about it.
- Use it to clean up any garbled instances that you didn't catch in the text from your speech process.
- And then lastly, if you're saying anything that requires some sort of proof, you can also have the LLM reference any of those instances in your article and find first-party sources.

LLMs have gotten pretty good at searching the web to find the information that you're looking for. You can tell it to only find first-party sources on the things that you want to reference in your article and then make sure those things get linked appropriately so that you have proof behind the thing that you said, and that people can go and look at those first-party resources to verify it themselves.

In my own projects as I work through them and add to my challenges.md file, along with the way in which I plan to build a project using what I call the project.md file, I can use dictation to quickly stub my thoughts and then come back around later to clean it up. This gives me a lot of resources at the end of the project to then hand over to my interview skill and Claude to list out questions to help tease out the story of building out the application or whatever it is in my article I'm wanting to say about it.

I think the biggest downside to the speech-to-text process is the verbosity at which we typically speak, but not type. So having to go back through an article and rip out any text to make sure it makes sense is a process that takes a little bit of patience. But I think the trade-off is still worth it compared to just outputting a lot of generated text from the LLM.

Another way you can protect yourself from that verbosity is to use text-to-speech in the opposite direction to have it read out to you. And if it feels like it's taking forever, that's an indication that you're too verbose and you can pull back and re-edit that line. This will also help you catch any spots where the speech-to-text was garbled.

## Speech-to-text tools

The particular tool that I use is called [Spokenly](https://spokenly.app), but there are many other tools: some free, some open source, some paid. There are some built into the operating system, but I find that the one built into macOS isn't as powerful or as accurate. I think the thing you want to find is the tool that is as accurate as possible, even if it takes a little while for it to actually dictate onto the screen, because accuracy means you don't have to go back as often or as much to fix issues that get garbled in the speech-to-text process.

- [Spokenly](https://spokenly.app): closed source. Free with local models, paid tier for cloud ones. Mac, Windows, Linux, iPhone.
- [MacWhisper](https://macwhisper.com): closed source. Free tier, one-time payment for Pro. Mac only, and it transcribes on your machine.
- [Superwhisper](https://superwhisper.com): closed source. Free tier, paid subscription. Mac, Windows, iOS, and it works offline.
- [Wispr Flow](https://wisprflow.ai): closed source. Free trial, then paid. Mac, Windows, iPhone, Android.
- [VoiceInk](https://github.com/Beingpax/VoiceInk): in between. The source is on GitHub under GPLv3, and a paid license gets you the built app and updates. Mac only.
- [Whisper](https://github.com/openai/whisper): open source, MIT. Not an app. It is the OpenAI model most of the others run.
- [whisper.cpp](https://github.com/ggml-org/whisper.cpp): open source, MIT. Runs Whisper on your own machine in C/C++ with no dependencies.

The reason why I chose Spokenly is because it's free, it has local models, and it can be put into local-only mode, meaning it doesn't make any outbound connections to other servers. I'm making no endorsements of any of these products. You gotta choose what's best for you.

## Taking a step back when you're done

Another step that people don't really take and probably should is to be patient. When you're done writing something, let it sit there for a day or two and then review it. Reread it to make sure it still says what you want it to say and that it's going to get the point across that you're trying to make. There have been several times at which I would create an article just to come back a day later and ask myself what the hell I was trying to say. Take your time and your patience will be rewarded.

## LLM etiquette

Something I wanted to point out here is the etiquette around how society chooses to use, disclose, and collect information using LLMs. I think if you work in an academic field, a researcher or an educator, you need to be more careful of your usage of LLMs. You need to disclose how you used it and where you used it. You are held to a much higher standard when you work in a field where truth, accuracy, and trust are a key component of what you do. I feel it's one thing when you're using it as a random poster, whether on social media, within your own notes, or some random blog post. But when you hold a position of trust in society, there seems to be a growing disdain for the use of LLMs.

There are a lot of people who would say that the collection of information and the synthesis of that information is where all the work is. And a researcher or educator should spend their time curating that work carefully and not using an LLM to do that job. I personally don't have any gripes with the use of an LLM when it's used within what I feel are guardrails of being a critic or an editor of text, but not the wholesale writer of that text. However, there are others who feel much more strongly about even those use cases. Depending on what field you find yourself in, you need to be careful of how you use these tools.

If you are a student or a learner, the collection and synthesis of information is far more critical to your education than the pure knowledge itself. You shouldn't be using an LLM, I believe, for either part of the process. This is the same example I would give when someone asks why do we have to do mathematics when we have calculators and computers that can do it for us? The point isn't the mathematics. The point isn't even knowing the formulas or how to get to the solution. The point is the critical thinking that you put yourself through to learn that process.

Above, I've stated what I feel are the guardrails that I've landed on for using LLMs. And you can think of this piece as my disclosure on how I plan to use it moving forward for my own writing.

## In conclusion

By having the LLM ask you questions in an interview process and then dictating your answers in text, you'll get output that better represents how you speak and word things compared to if you were to have the LLM try to write an article all on its own. You might say that defeats the purpose of using an LLM to create an article. I say that's the wrong way to use the tool. The better way to use an LLM is to have it as a critic, an editor, and a reviewer, so that you can better write articles based on your own voice, not something that was created by an LLM wholesale.

For someone like myself who doesn't particularly like writing and doesn't have an editor to review their stuff, it's fantastic to have a tool that can be critical in an intelligent manner of the thing I just wrote. And on top of that, since it's particularly good at coding, it can be a critic on that end as well.
