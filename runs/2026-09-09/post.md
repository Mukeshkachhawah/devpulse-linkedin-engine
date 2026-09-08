A retry that is not idempotent is just a slower way to create duplicates.

Timeout. Network blip. User double-clicks. The client fires again.

If your endpoint creates a row, charges a card, or sends an email on every call, the second request does not "fix" the first one. It does the work again.

Before you add `retry: 3` anywhere, pin down one thing:

What makes two requests the same request?

Useful patterns:

- Client sends an Idempotency-Key; server stores the first result and returns it on repeats
- Upsert by a natural key instead of blind insert
- Outbox / job id so a worker can skip work it already finished
- Prefer PUT/PATCH semantics when the outcome should converge, not accumulate

Retries are a reliability tool only when the operation can safely run twice.

Otherwise you did not make the system stronger. You made duplicate bugs more likely under load.

#SoftwareEngineering #BackendDevelopment #APIDesign #FullStackDevelopment #PracticalEngineering
