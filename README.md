# DevPulse LinkedIn Engine

A safety-first LinkedIn content workflow for developers, powered by Codex and
Noodle.

DevPulse generates one concise, original software-engineering post, reviews it
for quality, archives every draft by date, and can schedule publishing only
after the account and authentication gates pass.

## Why this project exists

Content automation should not mean careless automation. This workflow is built
to fail closed: it will not publish when authentication is missing, the active
LinkedIn account cannot be verified, or the first-post approval marker is not
present.

## Highlights

- Natural developer-focused posts without generic AI filler
- Topics covering full-stack development, AI, programming, tools, and practical engineering
- Strong hooks, short paragraphs, useful takeaways, and relevant hashtags
- One-post-per-day guardrails and duplicate-attempt protection
- Append-only dated archive under `runs/YYYY-MM-DD/`
- Configurable local posting time (default: 9:00 AM Asia/Kolkata)
- Explicit account verification before publishing
- No passwords, cookies, session tokens, or API secrets stored in the project
- No likes, comments, messages, follows, or connection requests

## Project structure

```text
.agents/skills/
|-- linkedin-daily-post/   Post generation, review, and publishing safeguards
|-- schedule/              Daily scheduling rules
`-- noodle/                Noodle workflow guidance
scripts/                   Windows setup and automation controls
settings/                  Posting time, account, and topic configuration
state/                     Idempotency and last-run state
runs/YYYY-MM-DD/           Append-only post and result archive
.noodle.toml               Codex provider and Noodle runtime configuration
```

## Safety model

Publishing is disabled by default. The workflow requires all of these before a
post can be published:

1. Explicit first-post approval
2. An authenticated supported browser or LinkedIn create-post connector
3. An exact visible match with the configured LinkedIn account
4. No earlier publish attempt for the current local date

If any check fails, the workflow records the failure and does not publish.

## Configuration

Edit `settings/linkedin-daily-post.json`:

```json
{
  "time_zone": "Asia/Kolkata",
  "posting_time": "09:00",
  "expected_account": "Your LinkedIn Name",
  "topics": [
    "software development",
    "full-stack development",
    "AI",
    "programming",
    "developer productivity"
  ]
}
```

Never add credentials or browser session data to this file.

## Windows commands

Authenticate Codex without placing credentials in the terminal or repository:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Login-Codex.ps1
```

Enable daily automation only after approving and verifying the first test post:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Enable-LinkedInAutomation.ps1 -FirstPostApproved
```

Change the posting time:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Set-LinkedInPostingTime.ps1 -Time "10:30"
```

Disable automation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Disable-LinkedInAutomation.ps1
```

## Archive behavior

Previous posts are never overwritten. Each calendar day gets its own folder.
If more than one draft is generated on the same date, the workflow selects the
next available pair such as `post-2.md` and `result-2.json`.

## Current status

- Local generation and quality review: ready
- Dated append-only archive: ready
- First dry run: completed without publishing
- Live publishing: intentionally disabled until authenticated account verification and explicit approval

---

Built by [Mukesh Kachhawah](https://github.com/Mukeshkachhawah) while exploring
practical developer automation and AI-assisted workflows.
