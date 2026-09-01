---
name: schedule
description: Schedule the daily LinkedIn publishing order from local settings and run state.
schedule: Re-evaluate when orders are empty, after a session completes, and when local time crosses the configured daily posting time.
---

# Daily LinkedIn scheduler

Read `.noodle/mise.json`, `settings/linkedin-daily-post.json`, and
`state/linkedin-daily-post.json`. Write only `.noodle/orders-next.json`; Noodle
promotes that file atomically.

Use `noodle schema mise` and `noodle schema orders` as the current schema source
of truth. Never copy active orders into the new-order file, and never schedule a
duplicate of an active or completed daily order.

## Activation and timing

The automation is enabled only when `settings/linkedin-daily-post.enabled`
exists. If it does not exist, write `{"orders":[]}`.

Read `time_zone` and `posting_time` from the settings file. Determine the
current date and time in that time zone. Schedule at most one attempt for a
local calendar date, at or after the configured time. If the machine or Noodle
was offline at the configured time, schedule the missed attempt when the loop
next runs that same day.

Do not schedule when any of these is true:

- Local time is before `posting_time`.
- `last_attempt_date` or `last_success_date` equals today's local date.
- An order or stage for `linkedin-daily-post-YYYY-MM-DD` is active, pending, or
  completed in current or recent state.
- `expected_account` is missing, null, or blank.

## Order

When due, write one standalone order with ID
`linkedin-daily-post-YYYY-MM-DD`. It has one sequential stage:

- `do`: `linkedin-daily-post`
- `with`: copy the Codex provider from the routing defaults in the mise
- `model`: copy the model from the routing defaults in the mise
- runtime: `process`
- prompt: include the local date, time zone, configured account, and the words
  `PUBLISH MODE`. State that the enable marker is the standing authorization
  for one post that day, subject to every safety check in the skill.

Use the exact field names and required lifecycle fields from
`noodle schema orders`. When nothing is due, always write
`{"orders":[]}` to prevent a hot scheduling loop.

Never create orders for messages, connection requests, comments, reactions,
profile edits, or any LinkedIn action other than the single daily post.
