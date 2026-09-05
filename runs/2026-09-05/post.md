If a call to another service has no timeout, your app can get stuck waiting for it.

A slow API, database query, or internal service can block work, fill queues, and make the rest of your system look broken.

Before you ship an outbound call, decide these four things:

- How long will you wait before you fail?
- How many retries are allowed, and how long between them?
- What should the user or caller see when it fails?
- Is it safe to retry, or must the request run only once?

Failing fast is often better than hanging for a long time. A clear timeout turns a freeze into an error you can handle.

Do not treat “it usually responds quickly” as a reliability plan.

#SoftwareEngineering #Backend #PracticalEngineering #DeveloperProductivity