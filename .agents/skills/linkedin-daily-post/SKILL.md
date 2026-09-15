---
name: linkedin-daily-post
description: Generate, review, and—only when explicitly enabled—publish one original daily LinkedIn post about practical software engineering.
schedule: Standalone single-stage order once per local calendar day at or after the configured posting time, only when enabled and not already attempted that day.
---

# LinkedIn daily post

Create exactly one concise, useful LinkedIn post. In `DRY RUN` mode, generate
and review the post but never open LinkedIn or perform any external action. In
`PUBLISH MODE`, follow every gate below and fail closed if a gate cannot be
verified.

## Inputs and state

Read:

- `settings/linkedin-daily-post.json` for time zone, posting time, expected
  account, and topic scope.
- `state/linkedin-daily-post.json` for idempotency.
- The dispatched order prompt to determine `DRY RUN` or `PUBLISH MODE`.

Use the local date in the configured time zone. Treat `runs/` as an append-only
archive: never delete, rename, truncate, or overwrite an existing file or dated
folder.

For each run, create or reuse `runs/YYYY-MM-DD/` and choose the first available
filename pair:

- `post.md` and `result.json`
- `post-2.md` and `result-2.json`
- `post-3.md` and `result-3.json`, continuing numerically as needed

Use the same suffix for the reviewed draft and its outcome. A new calendar day
must always use its own new `runs/YYYY-MM-DD/` folder, leaving every earlier
date untouched.

## Generate

Choose one focused idea from software development, full-stack development, AI,
programming, developer productivity, lessons learned, tools, or practical
engineering.

### Mandatory uniqueness gate (before drafting)

Search all existing `runs/**/post*.md` for the intended hook, core claim, and
key terms. Reject the idea if any prior draft already covers the same theme,
takeaway, hook idea, or series angle — even with different wording. A
compressed remake of an earlier History-of-AI (or other) series episode is not
allowed. If blocked, pick a genuinely unused angle; do not paraphrase.

Rotate topics and angles by checking previous files under `runs/`.

The post must:

- Be original; never copy, closely paraphrase, or imitate another person's post
  or any prior local `runs/` draft.
- Use a natural developer voice and avoid generic AI phrasing.
- Start with a strong, specific hook.
- Use short paragraphs and bullets only when they improve clarity.
- Stay concise and deliver a practical idea, tradeoff, checklist, or lesson.
- End with 3-5 genuinely relevant hashtags.
- Use no emojis by default and never use excessive emojis.
- Avoid fake claims, invented metrics, fabricated personal experience, and
  unsourced time-sensitive facts.
- Avoid spammy engagement bait, forced questions, and requests to like, share,
  comment, or follow.

Do not browse other people's LinkedIn posts for inspiration. If a current fact
is essential, verify it using an authoritative source; otherwise choose a
timeless engineering topic.

## Review

Before any publishing action, revise the draft once using this checklist:

- The hook earns attention without exaggeration.
- The post makes one clear point and includes concrete value.
- Every claim is supportable and no personal experience was invented.
- The language sounds human, specific, and non-repetitive.
- Paragraphs are short, formatting is clean, and there are 3-5 hashtags.
- Uniqueness re-check passed: not the same theme/hook/claim as any prior
  `runs/**/post*.md` (rewording does not count as new).

If the draft fails any item, rewrite it with a different angle or topic. Save
only the approved version.

## Dry run

When the prompt says `DRY RUN`:

1. Generate and review the post.
2. Do not open LinkedIn or any browser.
3. Write the paired result file with `mode: "dry_run"`, `reviewed: true`,
   `published: false`, and `status: "generated"`.
4. Do not update `state/linkedin-daily-post.json`.
5. Report that generation succeeded and publishing was intentionally skipped.

## Publish gates

When the prompt says `PUBLISH MODE`, continue only if all are true:

1. `settings/linkedin-daily-post.enabled` exists.
2. `expected_account` is non-empty.
3. Neither `last_attempt_date` nor `last_success_date` equals today's local
   date.
4. A supported LinkedIn connector with create-post capability, the Codex
   authenticated Browser integration, or Antigravity's authenticated built-in
   `/browser` integration is available. When running in Antigravity, use its
   built-in Chrome browser agent; do not install or invoke Playwright.
5. LinkedIn is already authenticated. Never request, inspect, read, log, or
   expose passwords, cookies, session tokens, API secrets, browser storage, or
   credential files.
6. The visible active account identity exactly matches `expected_account`.

If authentication is required, stop before opening the composer and report:
`Authentication required: open LinkedIn in the same controlled browser that
will run this workflow, sign in there directly, then rerun the workflow.` Never
ask for credentials in chat.

If the browser/connector is unavailable, account identity is ambiguous, the
account differs, or any other gate fails, do not publish. Record and report the
specific failure.

## Publish workflow

Use a purpose-built LinkedIn create-post connector if one is available;
otherwise use the authenticated browser integration provided by the active
agent environment (Codex Browser or Antigravity `/browser`). Do not install
Playwright for Antigravity browser work. Do not use raw cookies, copied tokens,
unofficial APIs, or credential automation.

1. Open the LinkedIn home/feed page.
2. Verify the active account identity again against `expected_account`.
3. Check the account's recent posts and the local ledger for a same-day
   duplicate. Do not like, react, comment, message, follow, or connect while
   checking.
4. Open the new-post composer.
5. Paste the reviewed content exactly once.
6. Confirm the composer contains the full reviewed draft and no unintended
   attachment, audience change, mention, or link preview.
7. Verify the active account a final time.
8. Select Publish once. Never retry the publish click if the result is
   ambiguous; inspect the account's recent posts first.
9. Verify success from the visible confirmation or the new post on the account.

Do not perform any other LinkedIn action.

## Record and report

After a publish-mode attempt, update `state/linkedin-daily-post.json` with
today's local date as `last_attempt_date`, the final status, and a post URL when
available. Set `last_success_date` only after visible success is verified.

Write the paired result file containing the local date, mode, reviewed flag,
published boolean, status, expected account, verified account when available,
post URL when available, and a short error when unsuccessful. Never include
secrets or browser session data.

Report exactly whether publishing succeeded. A draft, filled composer, click,
or ambiguous UI state is not success.
