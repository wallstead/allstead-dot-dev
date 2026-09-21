---
title: "Why Bother With Lint Rules If AI Writes your Code?"
date: "2026-09-20"
description: Lint used to be for making code readable and consistent. Now it's an enforceable contract between you and your coding agent, and that makes it more important, not less.
---

A few days ago I merged a change at work that swapped ESLint for [oxlint](https://oxc.rs/docs/guide/usage/linter.html) across our monorepo. Oxlint is awesome by the way. With full ruleset parity, a full local lint went from 3 minutes to about 1 second. It was a good day. Finally I could tell people we could stop pushing with `--no-verify`, a nasty workaround that had become muscle memory for basically all of us as a means of bypassing slow local lint checks.

I started a slack thread where I explained the change to the team and mentioned that I was excited about the speed improvements because it would save everyone a lot of time, especially those like me that have switched to agentic engineering where I rarely touch the code myself. A colleague asked a fair question, something along the lines of

> If you're not writing the code by hand anymore why bother with lint rules at all?

That question deserves a thoughtful answer, because the role of lint has fundamentally shifted in the age of AI-assisted coding. 

_Spoiler: it's more important now than ever before._

## What lint was for pre-AI

Since the [dawn of linting](https://web.archive.org/web/20220123141016/https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.56.1841&rep=rep1&type=pdf), it's been a courtesy to the next human who reads the file, which could be you or another contributor. Consistent formatting, no unused imports, name things this way and not that way, don't reach for the 1 liner just because it solves it in less lines, because reading it should be easy and predictable. It's taking a styleguide and codifying it into rules that are enforceable automatically, so we don't all lose our minds working on complex codebases.

It also catches a category of things that aren't really "style" at all. A promise that wasn't properly awaited. A `useEffect` with a dependency missing from its array (love you, React). A variable that's declared, assigned, and never read. These aren't example of style. They're bugs, or things on the way to becoming bugs, and we can automatically catch them before they cause issues.

With AI writing code for us, those reader-facing and bug-catching jobs still exist. What's changed is who's writing and reading the code.

## The author changed. So did the readers.

When I point a coding agent at a Jira ticket, what it writes is code that will be read by my teammates in review, and maybe read by me in a few months if something breaks. Those readers still exist, and every reader-facing reason for lint is as valid as it ever was.

But there's a ✨ new ✨ reader now, and it reads more of the codebase than any human does. Before an agent writes a line, it reads the surrounding files to figure out how things are done in the codebase. It's not doing this for fun, or to burn tokens, it's looking for **patterns to copy**.

This makes codebase cleanliness compound in a way it didn't used to. Dead code and unused imports aren't just messy in the files they exist in, they're kind of poison to agents. Without a clean and consistent codebase, the agent can amplify those issues, spreading bad patterns with a codebase.

Without carefully maintaining an `AGENTS.md` file that documents the conventions and patterns the agents should follow, the AI will continue to pick up and propagate whatever it finds, good or bad. Even if you do maintain that prompt file, the AI might still ignore it. Those prompt files should be treated as guidance, not truly enforceable rules. There are no guarantees there.

This is where lint rules come to save the day. You create the set of rules, and the AI is forced to follow them just like a human would have to. There's the guarantee: code that violates those rules won't make it into your codebase because the linter will prevent pushing it. Well, it will if you set up a good CI/CD pipeline that enforces linting before merges, which you should!

## Review is a tight bottleneck

With AI writing a whole lot of code in a short period of time, there's a new scarce resource on the block for engineering teams: reviewer attention.

It's very common to hear the following in my 1-on-1s with engineers: 
> I struggle to get timely reviews.

> I feel like I'm constantly asking for reviews.

> I can write code faster than I can get it reviewed.

A reviewer is uniquely good at exactly one thing, which is judging *intent*. Does this change do what the ticket asked? Is this the right abstraction to use? Did we want this behavior to function like this? A human reviewer is a terrible use of time for "there's an unused variable on line 29" or "this promise is unused." Lint takes that entire set of checks off the reviewer's plate so their attention can go where it's most valuable.

If you drank the kool-aid and now believe that AI-written code needs *less* automated checking, you're unknowingly signing up for your coworkers to catch that stuff instead. This is going in precisely the wrong direction, and what you'll find is that you have 100 open PRs and 0 people who want to review them. Instead of a bottleneck you'd be looking at a cork.

## Let's get rid of type checking and testing too while we're at it

Nobody says "if AI writes it, why bother with automated testing." Same goes for type checking. The reason you check any author's output is that the author is fallible. AI Models are fallible in different and arguably less predictable ways than people, and that's all the more reason for _more_ deterministic validation, not less.

**Key takeaway:** AI-written code is not inherently more reliable than human-written code. It is simply faster at producing it. It needs strong guardrails in the form of linting, type checking, and automated testing, along with good prompting by an experienced engineer.

## Where to enforce it depends on who's committing

Once you accept that lint matters, the next question is where to run it, and this is the one place I think the answer genuinely depends on how you and your team work.

If a human is writing the code, a commit is a save point. You commit half-finished work so you can try something risky and get back. You might commit with a rogue `console.log` still in there because you're mid-debug and don't want to lose your progress. A `pre-commit` hook that blocks on lint turns every one of those save points into basically a chore, and maybe one that serves to distract you more than benefit you. For a human author, gating at `pre-push` is probably the right move. Gating at CI should be done by default in all cases as a last-resort backstop.

If an agent is writing the code, a commit isn't a save point. It's a checkpoint in the development loop it's doing before it gets back to you. The agent doesn't hit a blocker on commit due to a lint error that results in it having to muster the courage and multi-tasking effort to fix it. It doesn't get tired of fixing an unused import, and it doesn't lose its train of thought when a hook fails. It reads the error, fixes it, and commits again, usually in a few seconds. The earlier the failure, the shorter that loop, and the shorter the loop, the less lint debt accumulates across a branch. There's no need for a clean-up "Cleaned up lint errors" commit, because it was doing that along the way at each commit. For an agent author, I'd say `pre-commit` is the right place. If your linting is fast enough, you could take it further and force lint at each file the agent saves as it's working toward a commit, though I suspect there's diminishing returns at that level.

There's an awkward part here when teams are doing both, which basically all teams are right now. Some people are hand-writing code and some are directing agents, and sometimes the same person does one or the other in the same day. In this case, you have to set up the environment to accomodate the human. It's not the end of the world, you'll just find that your agents will likely follow the same pattern humans do, with the last commit in a branch being clean and all intermediate commits potentially having lint errors.

## Anyway..

In conclusion, engineering teams shouldn't drop the lint rules just because people are switching to solely coding with AI. The robot that writes my code has tenuous and expensive memory, not much taste, and infinite patience for fixing lint errors, which makes it the ideal lint audience.

Next up: swapping Prettier for oxfmt. I'll report back on whether that one also gets a Slack thread.
