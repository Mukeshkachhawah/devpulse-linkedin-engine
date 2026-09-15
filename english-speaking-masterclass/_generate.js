/**
 * Generator for Create_English_Speaking_Sheet.gs
 * Run: node _generate.js
 */
const fs = require('fs');
const path = require('path');

// ---------- CONTENT BANKS ----------

const L1_PHRASES = [
  ['I am going to work.', 'Roz subah bolo jab office ke liye niklo.', 'Main kaam pe ja raha/rahi hoon.'],
  ['This is easy.', 'Jab koi simple kaam kar rahe ho.', 'Ye aasan hai.'],
  ['I like this.', 'Kisi cheez ko pasand karte waqt.', 'Mujhe ye pasand hai.'],
  ['Can you help me?', 'Kisi se madad maangte waqt.', 'Kya aap meri madad kar sakte ho?'],
  ['I do not know this.', 'Jab kuch samajh na aaye.', 'Mujhe ye nahi pata.'],
  ['This is hard for me.', 'Mushkil kaam ke baare mein.', 'Ye mere liye mushkil hai.'],
  ['I will try again.', 'Failure ke baad motivate karne ke liye.', 'Main phir se koshish karunga/karungi.'],
  ['What is this?', 'Naye object/concept ke baare mein poochte waqt.', 'Ye kya hai?'],
  ['I am happy today.', 'Din ke start mein mood bolo.', 'Aaj main khush hoon.'],
  ['I need more time.', 'Deadline mangte waqt.', 'Mujhe thoda aur time chahiye.'],
  ['Let us start now.', 'Kaam shuru karte waqt.', 'Chalo ab shuru karte hain.'],
  ['I made a mistake.', 'Galti maanne ke liye.', 'Maine ek galti ki.'],
  ['That sounds good.', 'Idea approve karte waqt.', 'Ye theek lagta hai.'],
  ['I am not sure.', 'Doubt hone par honestly.', 'Mujhe sure nahi hai.'],
  ['Let me check.', 'Verify karne se pehle.', 'Main check karta/karti hoon.'],
  ['Please wait a minute.', 'Thoda time maangte waqt.', 'Please ek minute rukna.'],
  ['I finished my work.', 'Kaam khatam hone par.', 'Maine apna kaam khatam kar liya.'],
  ['How are you?', 'Greeting mein.', 'Aap kaise ho?'],
  ['Nice to meet you.', 'Pehli mulakat mein.', 'Aapse milkar khushi hui.'],
  ['I am learning English.', 'Apna goal batate waqt.', 'Main English seekh raha/rahi hoon.'],
  ['Can you say that again?', 'Jab clearly na suna ho.', 'Kya aap phir se bol sakte ho?'],
  ['I understand now.', 'Samajh aa jane par.', 'Ab mujhe samajh aa gaya.'],
  ['Thank you so much.', 'Shukriya karte waqt.', 'Bahut shukriya.'],
  ['Sorry for the delay.', 'Late hone par.', 'Deri ke liye maafi.'],
  ['I will call you later.', 'Baad mein baat karne ke liye.', 'Main baad mein call karta/karti hoon.'],
  ['Where should I sit?', 'Meeting room mein.', 'Main kahan baithoon?'],
  ['Is this correct?', 'Confirm karte waqt.', 'Kya ye sahi hai?'],
  ['I am ready.', 'Shuru hone ke liye.', 'Main taiyaar hoon.'],
  ['Please speak slowly.', 'Samajhne ke liye request.', 'Please dheere bolo.'],
  ['Have a good day.', 'Din ke end mein.', 'Aapka din accha rahe.']
];

const L2_PHRASES = [
  ['I think this will work.', 'Opinion dete waqt confidently.', 'Mujhe lagta hai ye kaam karega.'],
  ['Let me explain this quickly.', 'Samjhane se pehle.', 'Main jaldi se explain karta/karti hoon.'],
  ['I am not sure, let me check and get back to you.', 'Jab turant answer na ho.', 'Sure nahi, check karke aapko batata/batati hoon.'],
  ['That makes sense.', 'Jab baat samajh aa jaye.', 'Ye baat samajh aa gayi.'],
  ['Can you repeat that, please?', 'Clearly sunai na de.', 'Please phir se bolna.'],
  ['I have a question about this.', 'Meeting mein doubt clear karte waqt.', 'Iske baare mein ek sawaal hai.'],
  ['Let us go with this approach.', 'Decision finalize karte waqt.', 'Chalo isi approach pe chalte hain.'],
  ['I will take care of it.', 'Responsibility lete waqt.', 'Main iska dhyan rakhunga/rakhungi.'],
  ['This is a bit different from what I expected.', 'Mismatch politely note karte waqt.', 'Ye thoda alag hai jo maine socha tha.'],
  ['Could you give me an example?', 'Concept clear karne ke liye.', 'Kya ek example de sakte ho?'],
  ['I agree with most of this, but I have one concern.', 'Partial agreement.', 'Zyadatar agree, lekin ek concern hai.'],
  ['Let us move on to the next point.', 'Discussion aage badhate waqt.', 'Agle point pe chalte hain.'],
  ['I appreciate your help with this.', 'Professionally thank karte waqt.', 'Is madad ke liye shukriya.'],
  ['I will follow up on this by tomorrow.', 'Commitment dete waqt.', 'Kal tak ispe follow-up karta/karti hoon.'],
  ['That is a good point.', 'Acknowledge karte waqt.', 'Ye accha point hai.'],
  ['Can we sync for five minutes?', 'Short discussion maangte waqt.', 'Kya paanch minute sync kar sakte hain?'],
  ['I am blocked on this right now.', 'Blocker batate waqt.', 'Abhi main ispe blocked hoon.'],
  ['Let me share my screen.', 'Demo/walkthrough se pehle.', 'Main screen share karta/karti hoon.'],
  ['Could you clarify the requirement?', 'Clearity maangte waqt.', 'Requirement thodi clear kar doge?'],
  ['I will update the document after the call.', 'Post-meeting commitment.', 'Call ke baad document update karunga/karungi.'],
  ['Sorry, I missed that. Could you say it again?', 'Meeting mein miss hone par.', 'Miss ho gaya, phir se bolna please.'],
  ['I am available after lunch.', 'Availability batate waqt.', 'Lunch ke baad free hoon.'],
  ['Let us park this for now.', 'Topic baad ke liye rakhte waqt.', 'Abhi isko baad ke liye rakhte hain.'],
  ['I need your input on this decision.', 'Opinion maangte waqt.', 'Is decision pe aapki input chahiye.'],
  ['That works for me.', 'Agreement express karte waqt.', 'Mujhe ye theek hai.'],
  ['I will send a summary after this.', 'Meeting wrap-up.', 'Iske baad summary bhejta/bhejti hoon.'],
  ['Can we keep this short?', 'Time manage karte waqt.', 'Kya isko short rakh sakte hain?'],
  ['I am catching up on the context.', 'Late join hone par.', 'Main context catch-up kar raha/rahi hoon.'],
  ['Please correct me if I am wrong.', 'Humble clarification.', 'Agar galat hoon to correct kar dena.'],
  ['Looking forward to working with you.', 'Nayi collaboration shuru karte waqt.', 'Aapke saath kaam ka wait hai.']
];

const L3_PHRASES = [
  ['Let me walk you through my approach.', 'Interview mein solution explain karne se pehle.', 'Main apna approach step-by-step batata/batati hoon.'],
  ['The main challenge here was scalability.', 'Project problem describe karte waqt.', 'Yahan sabse badi challenge scalability thi.'],
  ['To optimize this, I refactored the logic.', 'Technical improvement explain karte waqt.', 'Optimize karne ke liye maine logic refactor kiya.'],
  ['There is a trade-off between speed and accuracy here.', 'Design decision justify karte waqt.', 'Yahan speed aur accuracy ke beech trade-off hai.'],
  ['I would prioritize this based on business impact.', 'Prioritization jawab.', 'Main business impact ke hisaab se prioritize karunga/karungi.'],
  ['Let me break this down step by step.', 'Complex answer structure.', 'Main isko step-by-step todta/todti hoon.'],
  ['In hindsight, I would have approached it differently.', 'Reflection question.', 'Aaj sochun to alag approach leta/leti.'],
  ['This design is scalable and easy to maintain.', 'System design discuss.', 'Ye design scalable aur maintainable hai.'],
  ['I collaborated closely with the backend team on this.', 'Teamwork example.', 'Maine backend team ke saath milkar kaam kiya.'],
  ['That is a great question, let me think about it for a second.', 'Time lene ke liye gracefully.', 'Accha sawaal hai, ek second sochne do.'],
  ['My key takeaway from that project was the importance of testing.', 'Learning question.', 'Usssi project se testing ki importance seekhi.'],
  ['I would love to learn more about the team\'s tech stack.', 'Reverse question.', 'Team ke tech stack ke baare mein aur jaanna chahunga/chahungi.'],
  ['I took ownership of the entire module end to end.', 'Ownership highlight.', 'Maine poora module end-to-end sambhala.'],
  ['Let us align on the requirements before diving into code.', 'Clarification.', 'Code se pehle requirements align kar lete hain.'],
  ['I am confident I can ramp up quickly on new technologies.', 'Adaptability.', 'Nayi tech pe jaldi ramp-up kar sakta/sakti hoon.'],
  ['I measured success using latency and error rate.', 'Metrics batate waqt.', 'Success ko latency aur error rate se measure kiya.'],
  ['We mitigated risk by rolling out behind a feature flag.', 'Risk management.', 'Feature flag ke peeche rollout karke risk kam kiya.'],
  ['I documented the decision so the team could revisit it later.', 'Documentation habit.', 'Decision document kiya taaki baad mein revisit ho sake.'],
  ['The bottleneck was in the database query, not the API layer.', 'Root cause.', 'Bottleneck DB query mein thi, API layer mein nahi.'],
  ['I proposed a simpler design to reduce operational complexity.', 'Simplicity argue.', 'Operational complexity kam karne ke liye simple design propose kiya.'],
  ['Cross-functional alignment was critical for shipping on time.', 'Cross-team work.', 'Time pe ship karne ke liye cross-functional alignment zaroori tha.'],
  ['I validated the assumption with a small prototype first.', 'Validation habit.', 'Pehle chhote prototype se assumption validate ki.'],
  ['We chose consistency over premature optimization.', 'Engineering judgment.', 'Premature optimization se pehle consistency choose ki.'],
  ['I owned the postmortem and drove the follow-up actions.', 'Incident ownership.', 'Postmortem own kiya aur follow-ups drive kiye.'],
  ['My role was to translate product goals into technical milestones.', 'Role clarify.', 'Product goals ko technical milestones mein translate kiya.'],
  ['I would ask clarifying questions before proposing a solution.', 'Interview mindset.', 'Solution se pehle clarifying questions poochunga/poochungi.'],
  ['The system handles failure gracefully with retries and timeouts.', 'Reliability.', 'Retries aur timeouts se system failure gracefully handle karta hai.'],
  ['I mentored a junior engineer through code reviews and pairing.', 'Mentorship.', 'Code review aur pairing se junior ko mentor kiya.'],
  ['We improved developer experience by reducing build times.', 'DX improvement.', 'Build time kam karke developer experience better kiya.'],
  ['I am curious how your team balances speed and quality.', 'Smart reverse Q.', 'Aapki team speed aur quality ka balance kaise karti hai?']
];

function padLevel(arr, level) {
  return arr.map(function (x, i) {
    return {
      level: level,
      day: (level - 1) * 30 + i + 1,
      phrase: x[0],
      context: x[1],
      hindi: x[2]
    };
  });
}

const PHRASES = padLevel(L1_PHRASES, 1).concat(padLevel(L2_PHRASES, 2), padLevel(L3_PHRASES, 3));

const L1_VOCAB = [
  ['Articulate', 'Clearly aur precisely bolna/likhna', 'I need to articulate my approach better.'],
  ['Hesitate', 'Rukna / der karna (doubt se)', 'Do not hesitate to ask clarifying questions.'],
  ['Assume', 'Bina proof ke maan lena', 'Let us not assume the API is idempotent.'],
  ['Clarify', 'Saaf / clear karna', 'Can you clarify the acceptance criteria?'],
  ['Outline', 'Sankshipt structure batana', 'Let me outline the migration steps.'],
  ['Elaborate', 'Zyada detail mein explain karna', 'Could you elaborate on the edge cases?'],
  ['Summarize', 'Short mein jist nikalna', 'Summarize the incident in two minutes.'],
  ['Emphasize', 'Zor dena / highlight karna', 'I want to emphasize the latency risk.'],
  ['Acknowledge', 'Maanna / accept karna', 'I acknowledge the delay on my side.'],
  ['Rephrase', 'Doosre words mein kehna', 'Let me rephrase that more simply.'],
  ['Infer', 'Hints se nateeja nikalna', 'From the logs, I infer a race condition.'],
  ['Imply', 'Seedha na kehke suggest karna', 'The metrics imply a cache miss problem.'],
  ['Justify', 'Reason dekar defend karna', 'How would you justify this design choice?'],
  ['Evaluate', 'Jaanch kar ke behtari decide karna', 'We evaluated three caching options.'],
  ['Assess', 'Andaza / assessment lena', 'Assess the blast radius before rolling out.'],
  ['Anticipate', 'Pehle se expect karna', 'I anticipate higher load during the sale.'],
  ['Overlook', 'Chhod dena / miss karna', 'We overlooked a null-check in validation.'],
  ['Underestimate', 'Kam aakna', 'Do not underestimate migration complexity.'],
  ['Overestimate', 'Zyada aakna', 'We overestimated how fast we could ship.'],
  ['Compromise', 'Compromise / beech ka raasta', 'We had to compromise on some polish.'],
  ['Negotiate', 'Baatcheet se terms fix karna', 'I negotiated a smaller scope for v1.'],
  ['Persuade', 'Manana', 'I persuaded the team to add monitoring first.'],
  ['Discourage', 'Himmat todna / rokna', 'Lack of tests discourages refactors.'],
  ['Encourage', 'Protshahan dena', 'Code reviews encourage better design.'],
  ['Contribute', 'Yogdaan dena', 'I contributed to the design doc.'],
  ['Coordinate', 'Milakar timing/work set karna', 'I coordinated with QA on the release.'],
  ['Facilitate', 'Aasaan banana / help karna', 'I facilitated the grooming session.'],
  ['Initiate', 'Shuru karna (formal)', 'I initiated the postmortem discussion.'],
  ['Resume', 'Phir se shuru karna', 'We can resume the rollout after the fix.'],
  ['Postpone', 'Baad mein shift karna', 'Let us postpone the release by a day.'],
  ['Prioritize', 'Pehle kya — order dena', 'I prioritized customer-facing bugs.'],
  ['Delegate', 'Kaam kisi aur ko dena', 'I delegated the UI polish to a teammate.'],
  ['Supervise', 'Dekh-bhaal karna', 'I supervised the junior on the first PR.'],
  ['Validate', 'Sahi hai ya nahi check karna', 'Validate the assumption with a prototype.'],
  ['Verify', 'Confirm / double-check karna', 'Verify the fix on staging first.'],
  ['Inspect', 'Bariq se dekhna', 'Inspect the slow query plan carefully.'],
  ['Diagnose', 'Problem ki wajah dhundhna', 'I diagnosed a memory leak in the worker.'],
  ['Resolve', 'Hal nikalna', 'We resolved the merge conflicts today.'],
  ['Address', 'Issue pe kaam / jawab dena', 'How did you address the scalability concern?'],
  ['Tackle', 'Nibhana / face karna', 'I tackled the flaky tests first.'],
  ['Navigate', 'Mushkil situation sambhalna', 'I navigated conflicting stakeholder needs.'],
  ['Adapt', 'Badalte hisaab se dhalna', 'I adapt quickly to new codebases.'],
  ['Iterate', 'Baar-baar improve karna', 'We iterated on the UX based on feedback.'],
  ['Refine', 'Aur behtar banana', 'Refine the error messages for users.'],
  ['Simplify', 'Simple banana', 'Simplify the API surface for clients.'],
  ['Streamline', 'Process ko seedha/efficient banana', 'We streamlined the onboarding checklist.'],
  ['Consolidate', 'Ek jagah jodna', 'Consolidate duplicate config files.'],
  ['Distinguish', 'Faraq samajhna', 'Distinguish symptoms from root cause.'],
  ['Demonstrate', 'Dikha ke prove karna', 'Demonstrate the bug with a repro script.'],
  ['Illustrate', 'Example se samjhana', 'Illustrate the flow with a sequence diagram.'],
  ['Convey', 'Baat pahunchana', 'I conveyed the risk to product clearly.'],
  ['Express', 'Apni baat kehna', 'Express disagreement politely in the review.'],
  ['Interpret', 'Matlab nikalna', 'How do you interpret these latency spikes?'],
  ['Perceive', 'Mahsoos / dekhna', 'Users perceive the app as slow.'],
  ['Recognize', 'Pehchanna / maanna', 'I recognize this was a process failure.'],
  ['Recall', 'Yaad karna', 'I recall we hit this bug last quarter.'],
  ['Retain', 'Yaad / rakh ke rakhna', 'Retain the feature flag for two weeks.'],
  ['Omit', 'Chhod dena (jaan-bujh ke)', 'Omit optional fields from the payload.'],
  ['Exclude', 'Bahar rakhna', 'Exclude staging traffic from the alert.'],
  ['Include', 'Shamil karna', 'Include rollback steps in the runbook.']
];

const L2_VOCAB = [
  ['Escalate', 'Upar / serious channel pe le jana', 'Escalate if the outage crosses 15 minutes.'],
  ['Bandwidth', 'Time/capacity jo available ho', 'I do not have bandwidth for a new project.'],
  ['Stakeholder', 'Jiska interest/asar ho', 'Align stakeholders before changing scope.'],
  ['Nuance', 'Fine difference / bariq baat', 'There is a nuance between latency and lag.'],
  ['Proactive', 'Problem aane se pehle action', 'Be proactive about flagging risks early.'],
  ['Reactive', 'Problem ke baad react karna', 'We were too reactive during the incident.'],
  ['Actionable', 'Jispe seedha kaam ho sake', 'Give actionable feedback in the review.'],
  ['Blocker', 'Jo aage badhne se roke', 'My only blocker is the missing API key.'],
  ['Dependency', 'Dusri cheez pe nirbhar', 'We have a dependency on the auth team.'],
  ['Deliverable', 'Jo deliver karna hai', 'The deliverable is a design doc by Friday.'],
  ['Milestone', 'Bada checkpoint', 'We hit the beta milestone this week.'],
  ['Timeline', 'Kab-tak ka plan', 'Share a realistic timeline for the rewrite.'],
  ['Bandwidth-constrained', 'Time/people kam hone ki wajah se limited', 'We are bandwidth-constrained this sprint.'],
  ['Tradeoff', 'Ek fayda vs doosra nuksaan', 'Explain the tradeoff of caching aggressively.'],
  ['Constraint', 'Seema / had', 'Memory is the main constraint on mobile.'],
  ['Scope creep', 'Scope dheere-dheere badhna', 'Avoid scope creep in the MVP.'],
  ['Alignment', 'Sab ek page pe hona', 'We need alignment on the success metrics.'],
  ['Buy-in', 'Support / agreement milna', 'Get buy-in from eng managers first.'],
  ['Hand-off', 'Kaam transfer karna', 'Document the hand-off for on-call.'],
  ['Sync-up', 'Short alignment meeting', 'Can we do a quick sync-up after standup?'],
  ['Follow-through', 'Promise ke baad complete karna', 'Strong follow-through builds trust.'],
  ['Accountable', 'Zimmedar (result ke liye)', 'I am accountable for the release quality.'],
  ['Ownership', 'Poori zimmedari lena', 'I took ownership of the payment module.'],
  ['Visibility', 'Dikhai / transparency', 'Add logging for better visibility.'],
  ['Transparency', 'Khula / clear communication', 'Transparency during outages reduces panic.'],
  ['Friction', 'Rukaawat / inconvenience', 'Too many approvals create friction.'],
  ['Bottleneck', 'Sabse slow / blocking part', 'Code review was the bottleneck.'],
  ['Workload', 'Kaam ka load', 'Balance the workload across the team.'],
  ['Capacity', 'Kitna sambhal sakte ho', 'Do we have capacity for this feature?'],
  ['Headcount', 'Team size (logon ki ginti)', 'We need more headcount for platform work.'],
  ['Ramp-up', 'Naye kaam pe speed pakadna', 'I can ramp up on Kotlin in two weeks.'],
  ['Onboard', 'Naye person ko set karna', 'I onboarded two interns last month.'],
  ['Offboard', 'Exit process / access hataana', 'Offboard access on the last working day.'],
  ['Runbook', 'Step-by-step ops guide', 'Update the runbook after every incident.'],
  ['Playbook', 'Standard response plan', 'Our incident playbook covers paging rules.'],
  ['Cadence', 'Regular rhythm / schedule', 'We run retros on a biweekly cadence.'],
  ['Cycle time', 'Idea se ship tak ka time', 'We reduced cycle time with smaller PRs.'],
  ['Loop in', 'Baatcheet mein shamil karna', 'Loop in security before we ship auth changes.'],
  ['Call out', 'Clearly highlight karna', 'I want to call out a risk in the design.'],
  ['Push back', 'Politely disagree / resist', 'I pushed back on an unrealistic deadline.'],
  ['Double down', 'Aur zyada focus/invest karna', 'We doubled down on automated tests.'],
  ['Dial back', 'Kam karna / slow down', 'Dial back the feature scope for launch.'],
  ['Takeaway', 'Key learning / conclusion', 'My takeaway is to add canaries earlier.'],
  ['Net-new', 'Bilkul naya', 'This is net-new work, not a bugfix.'],
  ['Low-hanging fruit', 'Aasan quick wins', 'Fixing typos is low-hanging fruit.'],
  ['North star', 'Main long-term goal', 'Latency under 100ms is our north star.'],
  ['Parking lot', 'Baad ke topics ki list', 'Put that idea in the parking lot for now.'],
  ['Action item', 'Concrete next task', 'Capture action items before we leave.'],
  ['Recap', 'Short summary dobara', 'Here is a quick recap of decisions.'],
  ['Async', 'Bina live meeting ke', 'Prefer async updates over long meetings.'],
  ['Sync', 'Live saath mein', 'Let us sync live on the architecture.'],
  ['Context-switch', 'Kaam badalte focus tootna', 'Too many meetings cause context-switching.'],
  ['Unblock', 'Rukaawat hatana', 'What do you need to unblock the PR?'],
  ['Ship', 'Release / live karna', 'We shipped the beta to 5% of users.'],
  ['Polish', 'Final refinement', 'The feature works; it needs polish.'],
  ['Caveat', 'Shart / warning', 'One caveat: this only works with Redis.'],
  ['Disclaimer', 'Pehle se warning/note', 'Disclaimer: numbers are approximate.'],
  ['Heuristic', 'Practical thumb rule', 'Use a heuristic before over-optimizing.'],
  ['Prerequisite', 'Pehle zaroori cheez', 'Tests are a prerequisite for merge.'],
  ['Non-negotiable', 'Jispe compromise nahi', 'Security review is non-negotiable.']
];

const L3_VOCAB = [
  ['Mitigate', 'Risk/asar kam karna', 'We mitigated downtime with a canary.'],
  ['Contention', 'Competition for shared resource', 'Lock contention slowed the writes.'],
  ['Idempotent', 'Repeat request = same result', 'Make the payment webhook idempotent.'],
  ['Leverage', 'Fayda uthana / use karna', 'Leverage existing metrics before adding more.'],
  ['Trade-off', 'Ek cheez vs doosri', 'There is a trade-off between consistency and availability.'],
  ['Orchestration', 'Kai steps/services coordinate karna', 'Use orchestration for the multi-step workflow.'],
  ['Observability', 'System andar se dikhna', 'Improve observability before the next release.'],
  ['Instrumentation', 'Metrics/logs/traces add karna', 'Add instrumentation around the checkout path.'],
  ['Resilience', 'Failure ke baad recover hona', 'Retries and timeouts improve resilience.'],
  ['Reliability', 'Bharosemand service', 'Reliability matters more than raw speed here.'],
  ['Throughput', 'Kitna kaam per unit time', 'Throughput dropped during the GC pause.'],
  ['Latency', 'Response delay', 'P99 latency spiked after the deploy.'],
  ['Bottleneck', 'Performance ki kami wali jagah', 'The DB CPU was the bottleneck.'],
  ['Saturation', 'Resource almost full', 'Disk saturation triggered the alerts.'],
  ['Backpressure', 'Upstream ko slow karne ka signal', 'The queue applies backpressure under load.'],
  ['Circuit breaker', 'Failing dependency se bachne ka pattern', 'Trip the circuit breaker when errors spike.'],
  ['Rate limiting', 'Request rate control', 'Rate limiting protected us from abuse.'],
  ['Thundering herd', 'Sab ek saath rush karna', 'Jitter helps avoid a thundering herd.'],
  ['Hot partition', 'Ek shard pe zyada load', 'UserId hashing caused a hot partition.'],
  ['Fan-out', 'Ek event se kai consumers', 'Notification fan-out stressed the workers.'],
  ['Fan-in', 'Kai sources ek jagah', 'Metrics fan-in to a central store.'],
  ['Eventual consistency', 'Baad mein consistent hona', 'The feed uses eventual consistency.'],
  ['Strong consistency', 'Turant same data', 'Payments need strong consistency.'],
  ['Stale read', 'Purana data padhna', 'Caching caused a stale read of balances.'],
  ['Race condition', 'Timing pe depend bug', 'A race condition corrupted the counter.'],
  ['Deadlock', 'Circular wait lock', 'Two transactions hit a deadlock.'],
  ['Starvation', 'Resource kabhi na milna', 'Low-priority jobs faced starvation.'],
  ['Quorum', 'Majority agreement', 'Writes need a quorum of replicas.'],
  ['Replication lag', 'Replica pe deri', 'Reporting queries suffered replication lag.'],
  ['Failover', 'Healthy node pe shift', 'Automatic failover restored the service.'],
  ['Rollback', 'Purane version pe lautna', 'We rolled back within three minutes.'],
  ['Rollout', 'Dheere-dheere release', 'Do a percentage rollout behind a flag.'],
  ['Canary', 'Thode users pe pehle test', 'Canary caught the memory leak.'],
  ['Blue-green', 'Do identical envs se switch', 'Blue-green deploy cut downtime.'],
  ['Feature flag', 'Runtime on/off switch', 'Ship dark with a feature flag.'],
  ['Dark launch', 'Users ko dikhaye bina live', 'We dark-launched the recommendation API.'],
  ['Blast radius', 'Failure ka failaav', 'Limit blast radius with cell-based design.'],
  ['Degradation', 'Quality/speed girna', 'Graceful degradation kept checkout alive.'],
  ['SLO', 'Internal reliability target', 'Our SLO is 99.9% monthly availability.'],
  ['SLA', 'Customer-facing reliability promise', 'Breaching the SLA triggers credits.'],
  ['Error budget', 'Allowed failure room', 'We paused features to protect the error budget.'],
  ['Postmortem', 'Incident ke baad analysis', 'Write a blameless postmortem within 48 hours.'],
  ['Root cause', 'Asli wajah', 'The root cause was a bad config push.'],
  ['Technical debt', 'Jaldbazi ka future cost', 'We scheduled a week to pay technical debt.'],
  ['Abstraction', 'Details hide karke simple interface', 'Pick the right abstraction for storage.'],
  ['Encapsulation', 'Data+logic band karna', 'Encapsulation keeps invariants safe.'],
  ['Cohesion', 'Related cheezein saath', 'High cohesion makes modules easier to change.'],
  ['Coupling', 'Modules ka interdependence', 'Loose coupling lets teams move independently.'],
  ['Idempotency key', 'Duplicate request rokne ka key', 'Clients send an idempotency key with charges.'],
  ['Schema migration', 'DB structure change carefully', 'Plan a backward-compatible schema migration.'],
  ['Contract test', 'API agreement verify', 'Contract tests caught a breaking change.'],
  ['Chaos engineering', 'Failure inject karke seekhna', 'Chaos experiments improved our runbooks.'],
  ['Horizontal scaling', 'Machines badha ke scale', 'Horizontal scaling handled the traffic spike.'],
  ['Vertical scaling', 'Badi machine se scale', 'Vertical scaling hit a cost ceiling.'],
  ['Sharding', 'Data tukdon mein baantna', 'We shard by tenant id.'],
  ['Caching strategy', 'Kya/kab cache karna', 'Explain your caching strategy and TTLs.'],
  ['Invalidation', 'Purana cache hataana', 'Cache invalidation caused a brief thundering herd.'],
  ['Optimistic locking', 'Version check se conflict handle', 'Use optimistic locking for concurrent edits.'],
  ['Pessimistic locking', 'Pehle lock leke edit', 'Pessimistic locking serialized inventory updates.'],
  ['Backfill', 'Purana data baad mein bharna', 'Run a backfill after adding the new column.']
];

const VOCAB = L1_VOCAB.concat(L2_VOCAB, L3_VOCAB).map(function (v, i) {
  const level = i < 60 ? 1 : i < 120 ? 2 : 3;
  return { word: v[0], meaning: v[1], example: v[2], level: level, index: i };
});

// 180 translation drills: Hindi -> English (2 per day)
const L1_TRANS = [
  ['Main kaam pe ja raha hoon.', 'I am going to work.'],
  ['Ye aasan hai.', 'This is easy.'],
  ['Mujhe ye pasand hai.', 'I like this.'],
  ['Kya aap meri madad kar sakte ho?', 'Can you help me?'],
  ['Mujhe ye nahi pata.', 'I do not know this.'],
  ['Ye mere liye mushkil hai.', 'This is hard for me.'],
  ['Main phir se koshish karunga.', 'I will try again.'],
  ['Ye kya hai?', 'What is this?'],
  ['Aaj main khush hoon.', 'I am happy today.'],
  ['Mujhe thoda aur time chahiye.', 'I need more time.'],
  ['Chalo ab shuru karte hain.', 'Let us start now.'],
  ['Maine ek galti ki.', 'I made a mistake.'],
  ['Ye theek lagta hai.', 'That sounds good.'],
  ['Mujhe sure nahi hai.', 'I am not sure.'],
  ['Main check karta hoon.', 'Let me check.'],
  ['Please ek minute rukna.', 'Please wait a minute.'],
  ['Maine apna kaam khatam kar liya.', 'I finished my work.'],
  ['Aap kaise ho?', 'How are you?'],
  ['Aapse milkar khushi hui.', 'Nice to meet you.'],
  ['Main English seekh raha hoon.', 'I am learning English.'],
  ['Kya aap phir se bol sakte ho?', 'Can you say that again?'],
  ['Ab mujhe samajh aa gaya.', 'I understand now.'],
  ['Bahut shukriya.', 'Thank you so much.'],
  ['Deri ke liye maafi.', 'Sorry for the delay.'],
  ['Main baad mein call karta hoon.', 'I will call you later.'],
  ['Main kahan baithoon?', 'Where should I sit?'],
  ['Kya ye sahi hai?', 'Is this correct?'],
  ['Main taiyaar hoon.', 'I am ready.'],
  ['Please dheere bolo.', 'Please speak slowly.'],
  ['Aapka din accha rahe.', 'Have a good day.'],
  ['Mujhe pani chahiye.', 'I need water.'],
  ['Ye mera desk hai.', 'This is my desk.'],
  ['Meeting kab hai?', 'When is the meeting?'],
  ['Main thoda late hoon.', 'I am a little late.'],
  ['Door band kar do.', 'Please close the door.'],
  ['Laptop charge karna hai.', 'I need to charge my laptop.'],
  ['Wifi slow hai.', 'The wifi is slow.'],
  ['Message mil gaya.', 'I got the message.'],
  ['Kal milte hain.', 'See you tomorrow.'],
  ['Main ghar ja raha hoon.', 'I am going home.'],
  ['Lunch break kab hai?', 'When is the lunch break?'],
  ['Mujhe coffee chahiye.', 'I need coffee.'],
  ['Ye file open nahi ho rahi.', 'This file is not opening.'],
  ['Password galat hai.', 'The password is wrong.'],
  ['Main busy hoon.', 'I am busy.'],
  ['Thoda wait karo.', 'Please wait a bit.'],
  ['Samajh nahi aaya.', 'I did not understand.'],
  ['Phir se try karo.', 'Try again.'],
  ['Ye important hai.', 'This is important.'],
  ['Main free hoon.', 'I am free.'],
  ['Call cut ho gaya.', 'The call got disconnected.'],
  ['Screen share karo.', 'Please share your screen.'],
  ['Mute pe ho tum?', 'Are you on mute?'],
  ['Camera on karo.', 'Please turn on the camera.'],
  ['Link bhej do.', 'Please send the link.'],
  ['Notes le lo.', 'Please take notes.'],
  ['Main agree karta hoon.', 'I agree.'],
  ['Main disagree karta hoon.', 'I disagree.'],
  ['Ye idea accha hai.', 'This idea is good.'],
  ['Aaj kaam zyada hai.', 'I have a lot of work today.']
];

const L2_TRANS = [
  ['Mujhe lagta hai ye kaam karega.', 'I think this will work.'],
  ['Main jaldi se explain karta hoon.', 'Let me explain this quickly.'],
  ['Sure nahi, check karke batata hoon.', 'I am not sure, let me check and get back to you.'],
  ['Ye baat samajh aa gayi.', 'That makes sense.'],
  ['Please phir se bolna.', 'Can you repeat that, please?'],
  ['Iske baare mein ek sawaal hai.', 'I have a question about this.'],
  ['Isi approach pe chalte hain.', 'Let us go with this approach.'],
  ['Main iska dhyan rakhunga.', 'I will take care of it.'],
  ['Ye thoda alag hai jo socha tha.', 'This is a bit different from what I expected.'],
  ['Kya ek example de sakte ho?', 'Could you give me an example?'],
  ['Zyadatar agree, lekin ek concern hai.', 'I agree with most of this, but I have one concern.'],
  ['Agle point pe chalte hain.', 'Let us move on to the next point.'],
  ['Is madad ke liye shukriya.', 'I appreciate your help with this.'],
  ['Kal tak follow-up karta hoon.', 'I will follow up on this by tomorrow.'],
  ['Ye accha point hai.', 'That is a good point.'],
  ['Paanch minute sync kar sakte hain?', 'Can we sync for five minutes?'],
  ['Abhi main ispe blocked hoon.', 'I am blocked on this right now.'],
  ['Main screen share karta hoon.', 'Let me share my screen.'],
  ['Requirement thodi clear kar doge?', 'Could you clarify the requirement?'],
  ['Call ke baad document update karunga.', 'I will update the document after the call.'],
  ['Miss ho gaya, phir se bolna please.', 'Sorry, I missed that. Could you say it again?'],
  ['Lunch ke baad free hoon.', 'I am available after lunch.'],
  ['Abhi isko baad ke liye rakhte hain.', 'Let us park this for now.'],
  ['Is decision pe aapki input chahiye.', 'I need your input on this decision.'],
  ['Mujhe ye theek hai.', 'That works for me.'],
  ['Iske baad summary bhejta hoon.', 'I will send a summary after this.'],
  ['Isko short rakh sakte hain?', 'Can we keep this short?'],
  ['Main context catch-up kar raha hoon.', 'I am catching up on the context.'],
  ['Agar galat hoon to correct kar dena.', 'Please correct me if I am wrong.'],
  ['Aapke saath kaam ka wait hai.', 'Looking forward to working with you.'],
  ['Deadline tight hai.', 'The deadline is tight.'],
  ['Mujhe review chahiye.', 'I need a review.'],
  ['PR ready hai.', 'The pull request is ready.'],
  ['Bug reproduce ho gaya.', 'I was able to reproduce the bug.'],
  ['Staging pe test karo.', 'Please test it on staging.'],
  ['Production impact kam hai.', 'The production impact is low.'],
  ['Rollback plan ready hai.', 'The rollback plan is ready.'],
  ['Customer complaint aayi hai.', 'We received a customer complaint.'],
  ['Priority badha do.', 'Please increase the priority.'],
  ['Scope clear nahi hai.', 'The scope is not clear.'],
  ['Estimate do din ka hai.', 'The estimate is two days.'],
  ['Dependency kisi aur team pe hai.', 'There is a dependency on another team.'],
  ['Design review kal hai.', 'The design review is tomorrow.'],
  ['Docs update karne hain.', 'We need to update the docs.'],
  ['Monitoring alert aa raha hai.', 'A monitoring alert is firing.'],
  ['Latency badh gayi hai.', 'Latency has increased.'],
  ['Cache clear karna padega.', 'We will need to clear the cache.'],
  ['Feature flag on kar do.', 'Please turn on the feature flag.'],
  ['Release notes bhej do.', 'Please send the release notes.'],
  ['Standup skip karna hai?', 'Do we need to skip standup?'],
  ['Main WFH hoon aaj.', 'I am working from home today.'],
  ['Office aaunga kal.', 'I will come to the office tomorrow.'],
  ['Leave lena hai Monday ko.', 'I need to take leave on Monday.'],
  ['Calendar invite bhej do.', 'Please send a calendar invite.'],
  ['Timezone confirm kar lo.', 'Please confirm the timezone.'],
  ['Recording share kar dena.', 'Please share the recording.'],
  ['Action items list karo.', 'Please list the action items.'],
  ['Owner assign kar do.', 'Please assign an owner.'],
  ['Status green hai.', 'The status is green.'],
  ['Risk highlight karna hai.', 'We need to highlight the risk.']
];

const L3_TRANS = [
  ['Main apna approach step-by-step batata hoon.', 'Let me walk you through my approach.'],
  ['Yahan sabse badi challenge scalability thi.', 'The main challenge here was scalability.'],
  ['Optimize karne ke liye maine logic refactor kiya.', 'To optimize this, I refactored the logic.'],
  ['Yahan speed aur accuracy ke beech trade-off hai.', 'There is a trade-off between speed and accuracy here.'],
  ['Main business impact ke hisaab se prioritize karunga.', 'I would prioritize this based on business impact.'],
  ['Main isko step-by-step todta hoon.', 'Let me break this down step by step.'],
  ['Aaj sochun to alag approach leta.', 'In hindsight, I would have approached it differently.'],
  ['Ye design scalable aur maintainable hai.', 'This design is scalable and easy to maintain.'],
  ['Maine backend team ke saath milkar kaam kiya.', 'I collaborated closely with the backend team on this.'],
  ['Accha sawaal hai, ek second sochne do.', 'That is a great question, let me think about it for a second.'],
  ['Ussi project se testing ki importance seekhi.', 'My key takeaway from that project was the importance of testing.'],
  ['Team ke tech stack ke baare mein aur jaanna chahunga.', 'I would love to learn more about the team\'s tech stack.'],
  ['Maine poora module end-to-end sambhala.', 'I took ownership of the entire module end to end.'],
  ['Code se pehle requirements align kar lete hain.', 'Let us align on the requirements before diving into code.'],
  ['Nayi tech pe jaldi ramp-up kar sakta hoon.', 'I am confident I can ramp up quickly on new technologies.'],
  ['Success ko latency aur error rate se measure kiya.', 'I measured success using latency and error rate.'],
  ['Feature flag ke peeche rollout karke risk kam kiya.', 'We mitigated risk by rolling out behind a feature flag.'],
  ['Decision document kiya taaki baad mein revisit ho sake.', 'I documented the decision so the team could revisit it later.'],
  ['Bottleneck DB query mein thi, API layer mein nahi.', 'The bottleneck was in the database query, not the API layer.'],
  ['Operational complexity kam karne ke liye simple design propose kiya.', 'I proposed a simpler design to reduce operational complexity.'],
  ['Time pe ship karne ke liye cross-functional alignment zaroori tha.', 'Cross-functional alignment was critical for shipping on time.'],
  ['Pehle chhote prototype se assumption validate ki.', 'I validated the assumption with a small prototype first.'],
  ['Premature optimization se pehle consistency choose ki.', 'We chose consistency over premature optimization.'],
  ['Postmortem own kiya aur follow-ups drive kiye.', 'I owned the postmortem and drove the follow-up actions.'],
  ['Product goals ko technical milestones mein translate kiya.', 'My role was to translate product goals into technical milestones.'],
  ['Solution se pehle clarifying questions poochunga.', 'I would ask clarifying questions before proposing a solution.'],
  ['Retries aur timeouts se system failure gracefully handle karta hai.', 'The system handles failure gracefully with retries and timeouts.'],
  ['Code review aur pairing se junior ko mentor kiya.', 'I mentored a junior engineer through code reviews and pairing.'],
  ['Build time kam karke developer experience better kiya.', 'We improved developer experience by reducing build times.'],
  ['Aapki team speed aur quality ka balance kaise karti hai?', 'I am curious how your team balances speed and quality.'],
  ['Maine root cause analysis kiya.', 'I performed a root cause analysis.'],
  ['Humne SLA miss nahi kiya.', 'We did not miss the SLA.'],
  ['Observability improve karni thi.', 'We needed to improve observability.'],
  ['Cache invalidation tricky thi.', 'Cache invalidation was tricky.'],
  ['Idempotent API design kiya.', 'I designed the API to be idempotent.'],
  ['Canary release se risk kam hua.', 'The canary release reduced risk.'],
  ['Technical debt reduce kiya.', 'We reduced technical debt.'],
  ['Stakeholders ko update diya.', 'I updated the stakeholders.'],
  ['Scope creep rokna zaroori tha.', 'It was important to prevent scope creep.'],
  ['Ambiguity clear kar li.', 'I cleared the ambiguity.'],
  ['Benchmark results share kiye.', 'I shared the benchmark results.'],
  ['Concurrency bug fix kiya.', 'I fixed a concurrency bug.'],
  ['Schema migration carefully ki.', 'I carefully handled the schema migration.'],
  ['Telemetry se issue mila.', 'Telemetry helped us find the issue.'],
  ['Incident response lead kiya.', 'I led the incident response.'],
  ['Rollback within minutes hua.', 'We rolled back within minutes.'],
  ['Contract tests add kiye.', 'I added contract tests.'],
  ['Partition strategy revisit ki.', 'We revisited the partition strategy.'],
  ['Availability target 99.9% tha.', 'The availability target was 99.9%.'],
  ['Consistency model explain kiya.', 'I explained the consistency model.'],
  ['Queue backlog clear kiya.', 'We cleared the queue backlog.'],
  ['Circuit breaker add kiya.', 'I added a circuit breaker.'],
  ['Rate limiting enable ki.', 'We enabled rate limiting.'],
  ['Authz checks tighten kiye.', 'We tightened the authorization checks.'],
  ['PII masking ensure ki.', 'We ensured PII masking.'],
  ['Capacity planning ki.', 'I did the capacity planning.'],
  ['Cost optimization drive kiya.', 'I drove cost optimization.'],
  ['On-call runbook update kiya.', 'I updated the on-call runbook.'],
  ['Architecture decision record likha.', 'I wrote an architecture decision record.'],
  ['Interview mein STAR format use kiya.', 'I used the STAR format in the interview.']
];

const TRANS = L1_TRANS.concat(L2_TRANS, L3_TRANS);

const PRONUNCIATION = [
  ['v vs w', 'vine/wine, very/wery milana', 'very, wine, available, review, whenever', 'I reviewed the very first version.', 'Lips round for W, teeth+lip for V.'],
  ['th (θ soft)', 'think ko tink bolna', 'think, thank, three, both, path', 'I think both paths are fine.', 'Tongue between teeth, soft air.'],
  ['th (ð voiced)', 'this/that ko dis/dat', 'this, that, these, those, the', 'This is the thing that matters.', 'Same tongue position, add voice.'],
  ['-ed /t/', 'worked ko work-ed alag syllables', 'worked, talked, finished, asked', 'I finished and asked for review.', 'After unvoiced sound → /t/.'],
  ['-ed /d/', 'played ko play-ed alag', 'played, called, logged, reviewed', 'I called and reviewed the logs.', 'After voiced sound → /d/.'],
  ['-ed /ɪd/', 'needed/wanted ko needd', 'needed, wanted, decided, started', 'I needed time and started early.', 'After t/d → extra syllable /ɪd/.'],
  ['r (American soft)', 'r ko heavy roll karna', 'error, mirror, better, server', 'The server returned a better error.', 'Light touch, do not roll heavily.'],
  ['short i vs ee', 'ship/sheep milana', 'ship, sheep, bit, beat, live, leave', 'Please leave the live server alone.', 'i = short, ee = long smile.'],
  ['short e vs a', 'pen/pan, men/man', 'pen, pan, men, man, said, sad', 'The men said it was sad.', 'Open mouth more for /æ/.'],
  ['p/b/t/d endings', 'end consonants drop karna', 'stop, job, test, code, build', 'Stop the build and test the code.', 'Finish the last consonant clearly.'],
  ['silent letters', 'honest/hour mein h bolna', 'honest, hour, knowledge, write, debt', 'Be honest about the write path.', 'Do not pronounce silent letters.'],
  ['word stress', 'COMputer vs comPUter galat', 'computer, developer, important, available', 'Availability is important for users.', 'Stress the correct syllable.'],
  ['sentence stress', 'har word equal force', 'I NEED this TODAY', 'I need this today, not tomorrow.', 'Stress content words, soften small words.'],
  ['linking sounds', 'har word alag alag katna', 'an apple → anapple, pick it up', 'Can you pick it up for me?', 'Link final consonant to next vowel.'],
  ['schwa /ə/', 'har vowel full force', 'about, support, problem, banana', 'About the support problem…', 'Unstressed vowels become soft uh.'],
  ['l vs r', 'light/right, play/pray', 'light, right, play, pray, collect', 'Please collect the right logs.', 'Tongue tip up for L, curl for R.'],
  ['f vs p', 'coffee/copy, full/pull', 'coffee, copy, full, pull, file', 'Pull the full file copy.', 'F = teeth on lip, P = lips together.'],
  ['s vs sh', 'see/she, sip/ship', 'see, she, sip, ship, issue', 'She can see the issue.', 'sh = lips forward, softer.'],
  ['z sound', 'is/has ko iss/hass', 'is, has, was, please, because', 'Please check because it was failing.', 'Buzz the z, do not make it s.'],
  ['ng ending', 'going ko goin', 'going, running, testing, shipping', 'I am going to keep testing.', 'Keep the soft ng at the end.'],
  ['minimal: beach/bitch', 'ee vs i confusion', 'beach, bitch, sheet, shit', 'Avoid mixing beach and sheet.', 'Smile longer for ee.'],
  ['minimal: walk/work', 'o vs er confusion', 'walk, work, talk, turkey', 'I walk to work and talk.', 'work = er sound, walk = aw.'],
  ['ask /ɑːsk/ vs /æsk/', 'Indian ask vs US/UK variants', 'ask, answer, after, example', 'Can I ask a quick question?', 'Pick one accent and stay consistent.'],
  ['schedule', 'shed-yool vs sked-yool', 'schedule, school, scheme', 'What is on the schedule today?', 'US: SKED-jool is common in tech.'],
  ['data', 'day-ta vs dah-ta', 'data, database, status', 'Check the database status.', 'Both OK — stay consistent in one talk.'],
  ['route', 'root vs rowt', 'route, router, routine', 'Check the API route.', 'In networking, root is common.'],
  ['intonation up/down', 'har sentence flat tone', 'Yes? / Yes.  Really? / Really.', 'Are you free? Yes, I am free.', 'Questions often rise; statements fall.'],
  ['chunking pauses', 'bina saans ke lambi line', 'I finished the task / and pushed the PR.', 'I finished the task, and then I pushed the PR.', 'Pause at commas and idea breaks.'],
  ['filler control', 'um/uh zyada', 'Actually… / So… / Let me think…', 'Let me think for a second.', 'Replace um with a short pause.'],
  ['clarity over speed', 'tez bolna = unclear', 'slow → clear → then faster', 'I will speak slowly and clearly.', 'Clarity pehle, speed baad mein.']
];

const SPEAKING_TASKS = [
  ['Mirror drill', 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', '3 min', 1, 'Fluency'],
  ['Own sentences', 'Aaj ka word use karke 3 apne sentences banao aur bolo.', '5 min', 1, 'Vocab'],
  ['30-sec explain', 'Phone pe record karo — 30 second mein aaj ka topic explain karo.', '2 min', 1, 'Monologue'],
  ['Real use', 'Colleague/friend se aaj ka phrase real conversation mein use karo.', '5 min', 2, 'Conversation'],
  ['Phrase+word para', 'Word + phrase jodkar ek chhota paragraph bolo (bina likhe).', '4 min', 2, 'Fluency'],
  ['Work update', 'Apne kaam ka chhota update aaj ke word/phrase se bolo.', '3 min', 2, 'Workplace'],
  ['Intro with phrase', 'Aaine ke saamne intro do, aaj ka phrase zaroor daalo.', '3 min', 1, 'Interview'],
  ['Shadowing', 'Kisi short English video ko pause-copy karke shadow karo (1 min).', '5 min', 2, 'Pronunciation'],
  ['Roleplay: standup', 'Imagine standup — yesterday/today/blockers 45 second mein bolo.', '3 min', 2, 'Roleplay'],
  ['Roleplay: help', 'Colleague se help maangne ka 40-second roleplay karo.', '3 min', 1, 'Roleplay'],
  ['Hindi→English aloud', 'Translation drill ko pehle Hindi padho, phir English zor se bolo.', '5 min', 1, 'Translation'],
  ['60-sec story', 'Kal kya kiya — 60 second story bolo, present/past mix.', '4 min', 2, 'Monologue'],
  ['Disagree politely', 'Ek idea se disagree karo, lekin polite raho (40 sec).', '3 min', 2, 'Conversation'],
  ['Teach a word', 'Aaj ka word kisi ko English mein samjhao jaise teacher.', '3 min', 2, 'Vocab'],
  ['Meeting wrap', 'Meeting summary 4 bullets mein bol ke record karo.', '4 min', 3, 'Workplace'],
  ['Interview: project', 'Ek project STAR mein 90 second mein bolo.', '5 min', 3, 'Interview'],
  ['Interview: trade-off', 'Koi design trade-off 60 second mein explain karo.', '4 min', 3, 'Interview'],
  ['Bug walkthrough', 'Ek bug kaise dhunda aur fix kiya — walkthrough bolo.', '5 min', 3, 'Technical'],
  ['Ask clarifying Qs', 'Ek vague requirement pe 3 clarifying questions bolo.', '3 min', 3, 'Interview'],
  ['Praise + concern', 'Pehle agree, phir ek concern — 40 second.', '3 min', 2, 'Conversation'],
  ['Phone voice note', 'Friend ko English voice note bhejo (topic: aaj ka din).', '3 min', 1, 'Conversation'],
  ['Describe your desk', 'Apna desk/setup 45 second mein describe karo.', '3 min', 1, 'Monologue'],
  ['Explain a tool', 'Git/Jira/Slack mein se ek tool 60 sec explain karo.', '4 min', 2, 'Technical'],
  ['Future plan', 'Is hafte ka plan English mein bolo.', '3 min', 1, 'Monologue'],
  ['Apology + fix', 'Late hone ka apology + next step bolo.', '2 min', 2, 'Workplace'],
  ['Request firmly', 'Politely lekin clearly deadline extend maango.', '3 min', 2, 'Workplace'],
  ['Teach ELI10', 'Koi technical concept 10-saal bacche ko samjhao (60 sec).', '4 min', 3, 'Technical'],
  ['Debate light', 'Remote vs office — 2 points for, 1 against bolo.', '4 min', 3, 'Fluency'],
  ['Retell news', 'Koi short tech news English mein retell karo.', '4 min', 3, 'Monologue'],
  ['Closing drill', 'Call end phrases practice: thanks, next steps, bye.', '2 min', 1, 'Workplace']
];

const MONOLOGUE_TOPICS = [
  'Apna subah ka routine 60 second mein batao.',
  'Kal ka sabse interesting kaam explain karo.',
  'Favourite tool aur kyun — 60 second.',
  'Ek galti se kya seekha — short story.',
  'Agar aaj free ho to kya seekhoge?',
  'Team mein help maangne ka tarika describe karo.',
  'Ek meeting jo waste lagi — kyun, aur better kaise?',
  'Apna strongest skill + ek example.',
  'Weak area aur improve plan.',
  'Dream project kya hota agar full freedom milti.',
  'Code review mein kya dekhte ho?',
  'Production bug aaye to pehle 3 steps kya?',
  'Naya teammate onboard kaise karoge?',
  'Focus kaise protect karte ho deep work ke liye?',
  'Documentation kyun important hai — example ke saath.',
  'Remote collaboration tip jo aap use karte ho.',
  'Interview mein nervousness kaise handle karte ho?',
  'Ek decision jisme trade-off tha — batao.',
  'Customer complaint aaye to soft skills kaise use?',
  'English practice ka aaj ka goal kya hai?',
  'Books vs videos — aap kaise seekhte ho?',
  'Health + work balance short take.',
  'Favourite programming concept simple words mein.',
  'Agar mentor banoge to pehli advice kya?',
  'System slow ho to kaise debug start?',
  'Feature ship karne se pehle checklist bolo.',
  'Conflict teammate se — professionally resolve kaise?',
  'Success metric for today\'s practice.',
  'Ek open-source tool jo pasand hai — kyun?',
  '30 din baad English mein kya better hona chahiye?'
];

const SPEAKING_TASK_ROTATE = [
  'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.',
  'Aaj ke dono words use karke 3 sentences bolo.',
  'Phone record: 30 second mein aaj ka topic explain karo.',
  'Colleague/friend se aaj ka phrase real conversation mein use karo.',
  'Word + phrase jodkar bina likhe chhota paragraph bolo.',
  'Kaam ka chhota update aaj ke phrase/word se bolo.',
  'Intro do aur aaj ka phrase zaroor daalo.'
];

function ytSearch(q) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
}

// Listening prompts (~30) — rotate by day; YouTube search URLs (stable)
const LISTEN_BANK = [
  ['v vs w pronunciation English practice 2 minutes', 'Shadow 2-3 min: v vs w words.'],
  ['th sound pronunciation think thank this that', 'Shadow 2-3 min: soft/voiced th.'],
  ['ed ending pronunciation worked played needed', 'Shadow 2-3 min: -ed endings.'],
  ['American English R pronunciation practice', 'Shadow 2-3 min: soft R.'],
  ['ship sheep bit beat pronunciation minimal pairs', 'Shadow 2-3 min: short i vs ee.'],
  ['pen pan men man pronunciation practice', 'Shadow 2-3 min: e vs a.'],
  ['English word stress practice computer important', 'Shadow 2-3 min: word stress.'],
  ['English linking sounds connected speech practice', 'Shadow 2-3 min: linking.'],
  ['schwa sound English pronunciation about support', 'Shadow 2-3 min: schwa /ə/.'],
  ['English intonation questions vs statements', 'Shadow 2-3 min: rise/fall.'],
  ['BBC Learning English 6 Minute English', 'Listen 2-3 min: pick any short episode, shadow 1 line.'],
  ['English speaking slow and clear practice', 'Shadow 2-3 min: clarity over speed.'],
  ['filler words um uh how to pause English speaking', 'Listen 2-3 min: pause instead of um.'],
  ['standup meeting English phrases practice', 'Shadow 2-3 min: standup phrases.'],
  ['English for work meetings polite phrases', 'Shadow 2-3 min: meeting English.'],
  ['job interview English answers STAR method short', 'Shadow 2-3 min: interview answer.'],
  ['explain a bug English speaking practice', 'Shadow 2-3 min: technical explain.'],
  ['daily English conversation practice for beginners', 'Shadow 2-3 min: easy conversation.'],
  ['office English phrases I will follow up', 'Shadow 2-3 min: follow-up phrases.'],
  ['English pronunciation silent letters honest hour', 'Shadow 2-3 min: silent letters.'],
  ['L vs R pronunciation practice light right', 'Shadow 2-3 min: L vs R.'],
  ['F vs P pronunciation coffee copy', 'Shadow 2-3 min: F vs P.'],
  ['S vs SH pronunciation see she', 'Shadow 2-3 min: s vs sh.'],
  ['English chunking pauses speak clearly', 'Shadow 2-3 min: pause at commas.'],
  ['present perfect vs past simple English explanation short', 'Listen 2-3 min: tense contrast (optional).'],
  ['articles a an the English short lesson', 'Listen 2-3 min: articles.'],
  ['prepositions in on at English short', 'Listen 2-3 min: in/on/at.'],
  ['English email phrases could you please', 'Shadow 2-3 min: polite requests.'],
  ['English phone call phrases can you hear me', 'Shadow 2-3 min: call English.'],
  ['tech English vocabulary scalable optimize short', 'Shadow 2-3 min: tech vocab.']
];

// Grammar bites (~30)
const GRAMMAR_BANK = [
  ['a/an: consonant sound pe a, vowel sound pe an', 'a user / an update', 'a meeting / an hour'],
  ['Simple present = habit/facts', 'I work from home on Fridays.', 'She reviews PRs daily.'],
  ['Present continuous = abhi ho raha', 'I am debugging now.', 'We are shipping today.'],
  ['Past simple = finished time', 'I finished the task yesterday.', 'We deployed last week.'],
  ['Present perfect = past → now connection', 'I have fixed the bug.', 'Have you seen the doc?'],
  ['will = future decision/promise', 'I will send the summary.', 'We will check tomorrow.'],
  ['going to = planned future', 'I am going to refactor this.', 'We are going to sync at 3.'],
  ['can = ability/permission', 'I can help after lunch.', 'Can you clarify the scope?'],
  ['could = polite request', 'Could you review this PR?', 'Could we park this?'],
  ['should = advice', 'You should add tests.', 'We should clarify requirements.'],
  ['must / have to = necessity', 'I have to leave at 6.', 'We must fix the outage.'],
  ['don\'t have to ≠ must not', 'You don\'t have to join.', 'You must not share secrets.'],
  ['there is / there are', 'There is a bug in login.', 'There are two options.'],
  ['much / many', 'How much time do we need?', 'How many tickets are open?'],
  ['some / any', 'I need some context.', 'Do you have any blockers?'],
  ['in / on / at (time)', 'on Monday / at 3 PM / in June', 'I will call at noon.'],
  ['in / on / at (place)', 'in the office / on the call / at my desk', 'Meet me at the lobby.'],
  ['for / since', 'for 2 hours / since morning', 'I have been stuck since 10.'],
  ['because / so', 'It failed because of timeout.', 'It was late, so we rolled back.'],
  ['although / however', 'Although it is hard, I will try.', 'It works; however, it is slow.'],
  ['if + present, will...', 'If it fails, I will retry.', 'If you are free, we can sync.'],
  ['countable vs uncountable', 'two tasks / some information', 'advice (not advices)'],
  ['this / that / these / those', 'This bug is new.', 'Those logs look old.'],
  ['Comparatives', 'faster than / more scalable than', 'This is clearer than before.'],
  ['Superlatives', 'the fastest / the most important', 'This is the main risk.'],
  ['Passive (simple)', 'The bug was fixed.', 'The PR was approved.'],
  ['Reported speech (basic)', 'He said he was blocked.', 'She asked if I was free.'],
  ['Question forms', 'What is the impact?', 'Where should I start?'],
  ['Tag questions (light)', 'It is ready, right?', 'You can join, can\'t you?'],
  ['Articles with roles', 'I am a developer.', 'She is the owner of this module.']
];

// Indian-English mistakes (~30)
const MISTAKE_BANK = [
  ['I am having a doubt.', 'I have a doubt. / I have a question.', 'have + doubt/question (state), continuous mat use karo.'],
  ['I will do the needful.', 'I will take care of it. / I will do what is needed.', 'do the needful Indian office phrase hai; natural English alag.'],
  ['Please revert on this.', 'Please reply / get back to me.', 'revert = undo change; reply ke liye revert mat bolo.'],
  ['Prepone the meeting.', 'Move the meeting earlier. / Reschedule to an earlier time.', 'prepone dictionary mein rare; earlier use karo.'],
  ['I am agree.', 'I agree.', 'agree verb hai — am agree nahi.'],
  ['Myself Rohan.', 'I am Rohan. / This is Rohan.', 'myself sirf emphasize/reflexive ke liye.'],
  ['What is your good name?', 'What is your name?', 'good name unnatural lagta hai.'],
  ['Kindly do the needful ASAP.', 'Please take care of this as soon as you can.', 'kindly + needful + ASAP overload; simple bolo.'],
  ['I have a confusion.', 'I am confused. / I am unclear about this.', 'confusion noun theek, lekin I am confused natural.'],
  ['Out of station.', 'Out of town. / Traveling.', 'station travel ke liye out of town better.'],
  ['Passed out from college.', 'Graduated from college.', 'passed out = faint; graduate use karo.'],
  ['I will intimate you.', 'I will inform you. / I will let you know.', 'intimate different meaning; inform better.'],
  ['Today morning.', 'This morning.', 'this morning / tonight — today morning avoid.'],
  ['Discuss about the plan.', 'Discuss the plan.', 'discuss ke baad about nahi.'],
  ['I am not getting you.', 'I don\'t understand you. / Could you repeat?', 'getting you informal/unclear.'],
  ['Do one thing.', 'Here is an idea. / Can we try this?', 'do one thing filler hai; direct bolo.'],
  ['Only I am saying...', 'I am just saying... / What I mean is...', 'only placement awkward ho sakta.'],
  ['It is very much important.', 'It is very important.', 'very much yahan mat lagao.'],
  ['I request you to please...', 'Could you please...?', 'request you to please double polite unnatural.'],
  ['Update me the status.', 'Update me on the status. / Send me a status update.', 'update me on X.'],
  ['I am having 5 years experience.', 'I have 5 years of experience.', 'have experience — continuous nahi.'],
  ['He told that he is free.', 'He said that he is free. / He told me that...', 'tell needs object (told me).'],
  ['Close the call.', 'End the call. / Hang up.', 'end the call more natural.'],
  ['Share your screen share.', 'Please share your screen.', 'screen share dobara mat bolo.'],
  ['I am on leave from tomorrow.', 'I am on leave starting tomorrow. / I will be on leave from tomorrow.', 'starting tomorrow clear.'],
  ['Doubt clearance session.', 'Q&A session. / Clarification session.', 'doubt clearance Indian-campus tone.'],
  ['Please find the attached.', 'Please find the attachment. / Attached is the file.', 'find attached / attachment.'],
  ['I will check and revert.', 'I will check and get back to you.', 'get back to you natural.'],
  ['Lakh of users.', 'Hundreds of thousands of users. / About 100,000 users.', 'international audience ke liye numbers clear.'],
  ['Pin code.', 'ZIP code (US) / postal code', 'audience ke hisaab se postal/ZIP.']
];

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function jsArrOfObjects(items, fields) {
  return '[\n' + items.map(function (it) {
    const parts = fields.map(function (f) {
      const v = it[f];
      if (typeof v === 'number') return f + ': ' + v;
      return f + ": '" + esc(v) + "'";
    });
    return '  { ' + parts.join(', ') + ' }';
  }).join(',\n') + '\n]';
}

function jsArrOfArrays(rows) {
  return '[\n' + rows.map(function (r) {
    return '  [' + r.map(function (c) {
      if (typeof c === 'number') return c;
      return "'" + esc(c) + "'";
    }).join(', ') + ']';
  }).join(',\n') + '\n]';
}

const REAL_USE_TEMPLATES = [
  'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "{phrase}"',
  'Standup mein aaj ka phrase zaroor daalo: "{phrase}"',
  'Kisi colleague se help maangte waqt aaj ka phrase use karo: "{phrase}"',
  'Meeting mein ek baar aaj ka phrase naturally bolo: "{phrase}"',
  'PR comment / review reply mein aaj ka idea English mein likho (phrase related).',
  'End-of-day update voice note: aaj ka phrase include karo — "{phrase}"',
  'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.'
];

// Build daily plan content (90 days)
const DAYS = [];
for (let d = 1; d <= 90; d++) {
  const phrase = PHRASES[d - 1];
  const v1 = VOCAB[(d - 1) * 2];
  const v2 = VOCAB[(d - 1) * 2 + 1];
  const t1 = TRANS[(d - 1) * 2];
  const t2 = TRANS[(d - 1) * 2 + 1];
  const pron = PRONUNCIATION[(d - 1) % PRONUNCIATION.length];
  const task = SPEAKING_TASK_ROTATE[(d - 1) % SPEAKING_TASK_ROTATE.length];
  const mono = MONOLOGUE_TOPICS[(d - 1) % MONOLOGUE_TOPICS.length];
  const level = d <= 30 ? 1 : d <= 60 ? 2 : 3;
  const listen = LISTEN_BANK[(d - 1) % LISTEN_BANK.length];
  const grammar = GRAMMAR_BANK[(d - 1) % GRAMMAR_BANK.length];
  const mistake = MISTAKE_BANK[(d - 1) % MISTAKE_BANK.length];
  const realTpl = REAL_USE_TEMPLATES[(d - 1) % REAL_USE_TEMPLATES.length];
  DAYS.push({
    day: d,
    level: level,
    phrase: phrase.phrase,
    context: phrase.context,
    hindi: phrase.hindi,
    word1: v1.word,
    meaning1: v1.meaning,
    example1: v1.example,
    word2: v2.word,
    meaning2: v2.meaning,
    example2: v2.example,
    transHindi: t1[0] + ' | ' + t2[0],
    transEnglish: t1[1] + ' | ' + t2[1],
    pronFocus: pron[0] + ' — ' + pron[4],
    task: task,
    mono: mono,
    listen: listen[1] + ' ' + ytSearch(listen[0]),
    grammar: grammar[0],
    grammarEx: grammar[1] + ' | ' + grammar[2],
    mistakeWrong: mistake[0],
    mistakeRight: mistake[1],
    mistakeWhy: mistake[2],
    realUse: realTpl.replace('{phrase}', phrase.phrase)
  });
}

const TODAY_WORDS_PATH = path.join(__dirname, 'today-words.txt');

function loadTodayWords_() {
  if (!fs.existsSync(TODAY_WORDS_PATH)) return [];
  const lines = fs.readFileSync(TODAY_WORDS_PATH, 'utf8').split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split('|').map(function (p) { return p.trim(); });
    out.push({
      word: parts[0] || '',
      meaning: parts[1] || '',
      example: parts[2] || ''
    });
  }
  return out;
}

const TODAY_WORDS = loadTodayWords_();

const header = `/**
 * English Speaking Masterclass - 90 Days
 *
 * SETUP:
 * 1. sheets.google.com pe naya spreadsheet banao
 * 2. Extensions -> Apps Script (standalone script.google.com project mat banao)
 * 3. Code.gs mein ye poora file paste -> Save
 * 4. Run: setup (permissions Allow)
 * 5. Sheet reload -> menu "English Practice"
 *
 * Naya word dikhe? Local file today-words.txt mein add karo, phir node _generate.js + setupTodayWords
 * Timeout? Run setupDailyPlan / setupBanks / setupDrills / setupTracker / setupWeeklyReview / setupTodayWords alone.
 * Config hidden "_Meta" sheet mein store hota hai (PropertiesService use nahi).
 *
 * Tabs: Daily Plan | Phrase Bank | Vocabulary | Pronunciation | Translation | Speaking Tasks | Progress | Weekly Review | Today Words
 */

var THEME = {
  navy: '#0F172A',
  slate: '#1E293B',
  accent: '#0D9488',
  accentSoft: '#CCFBF1',
  accentText: '#115E59',
  headerFg: '#F8FAFC',
  muted: '#64748B',
  rowOdd: '#F8FAFC',
  border: '#CBD5E1',
  qBg: '#FFFBEB',
  qFg: '#1E293B',
  aBg: '#F0FDFA',
  aTagBg: '#99F6E4',
  aTagFg: '#115E59',
  mustKnow: '#0F766E',
  interview: '#C2410C',
  moduleColors: [
    '#0F766E', '#0369A1', '#7C3AED', '#B45309',
    '#BE123C', '#15803D', '#1D4ED8', '#0E7490'
  ]
};

var SHEET_NAMES = {
  daily: 'Daily Plan',
  phrases: 'Phrase Bank',
  vocab: 'Vocabulary',
  pron: 'Pronunciation',
  trans: 'Translation Drills',
  tasks: 'Speaking Tasks',
  tracker: 'Progress Tracker',
  weekly: 'Weekly Review',
  today: 'Today Words',
  meta: '_Meta'
};

// ================================================================
// SETUP
// ================================================================
function setup() {
  var ss = getSpreadsheet_();
  try {
    ss.rename('English Speaking Masterclass - 90 Days');
  } catch (e) {}

  ensureMetaSheet_(ss);

  // Light tabs FIRST so timeout ke baad bhi banks dikhein
  createPhraseBank_(ss);
  createVocabulary_(ss);
  createTodayWords_(ss);
  createPronunciation_(ss);
  createTranslationDrills_(ss);
  createSpeakingTasks_(ss);
  createProgressTracker_(ss);
  createWeeklyReview_(ss);
  // Heaviest last
  createDailyPlan_(ss);
  removeUnusedSheets_(ss);

  if (!getMeta_(ss, 'EN_START_DATE')) {
    setMeta_(ss, 'EN_START_DATE', Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'));
  }

  try {
    ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.daily));
  } catch (e) {}
  SpreadsheetApp.flush();

  var msg =
    'Ready!\\n\\n' +
    'Sheet URL:\\n' + ss.getUrl() + '\\n\\n' +
    'Tabs: Daily Plan + Phrase Bank + Vocabulary + Today Words + Pronunciation + Translation + Speaking Tasks + Progress + Weekly Review\\n' +
    '90 days pre-loaded (Level 1-3). Menu: English Practice\\n\\n' +
    'Agar sirf Daily Plan dikhe: Run setupOtherTabs()\\n' +
    'Timeout? Run setupDailyPlan / setupBanks / setupDrills / setupTracker / setupWeeklyReview / setupTodayWords alone.';
  Logger.log(msg);
  safeAlert_(msg);
}

function setupDailyPlan() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createDailyPlan_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.daily)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Daily Plan ready.\\n' + ss.getUrl());
}

/** Baaki saari tabs (jab Daily Plan pehle ban chuka ho / timeout) */
function setupOtherTabs() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createPhraseBank_(ss);
  createVocabulary_(ss);
  createTodayWords_(ss);
  createPronunciation_(ss);
  createTranslationDrills_(ss);
  createSpeakingTasks_(ss);
  createProgressTracker_(ss);
  createWeeklyReview_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.today)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Other tabs ready (incl. Today Words + Weekly Review).\\n' + ss.getUrl());
}

function setupBanks() {
  var ss = getSpreadsheet_();
  createPhraseBank_(ss);
  createVocabulary_(ss);
  createTodayWords_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.today)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Phrase Bank + Vocabulary + Today Words ready.\\n' + ss.getUrl());
}

function setupDrills() {
  var ss = getSpreadsheet_();
  createPronunciation_(ss);
  createTranslationDrills_(ss);
  createSpeakingTasks_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.trans)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Pronunciation + Translation + Speaking Tasks ready.\\n' + ss.getUrl());
}

function setupTracker() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createProgressTracker_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.tracker)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Progress Tracker ready.\\n' + ss.getUrl());
}

function setupWeeklyReview() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createWeeklyReview_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.weekly)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Weekly Review ready.\\n' + ss.getUrl());
}

function setupTodayWords() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createTodayWords_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.today)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Today Words ready. Naye words today-words.txt se aaye.\\n' + ss.getUrl());
}

/** Custom menu */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('English Practice')
    .addItem('Go to Today', 'goToToday')
    .addItem('Mark Today Done', 'markTodayDone')
    .addItem('Set Start Date', 'setStartDate')
    .addSeparator()
    .addItem('Collapse Level 1', 'collapseLevel1')
    .addItem('Expand Level 1', 'expandLevel1')
    .addItem('Collapse Level 2', 'collapseLevel2')
    .addItem('Expand Level 2', 'expandLevel2')
    .addItem('Collapse Level 3', 'collapseLevel3')
    .addItem('Expand Level 3', 'expandLevel3')
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('Rebuild')
        .addItem('Full setup', 'setup')
        .addItem('Other tabs (no Daily Plan)', 'setupOtherTabs')
        .addItem('Daily Plan only', 'setupDailyPlan')
        .addItem('Banks only', 'setupBanks')
        .addItem('Drills only', 'setupDrills')
        .addItem('Tracker only', 'setupTracker')
        .addItem('Weekly Review only', 'setupWeeklyReview')
        .addItem('Today Words only', 'setupTodayWords')
    )
    .addToUi();
}

// ================================================================
// HELPERS
// ================================================================
function getSpreadsheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  ss = SpreadsheetApp.create('English Speaking Masterclass - 90 Days');
  Logger.log('No active spreadsheet - created: ' + ss.getUrl());
  return ss;
}

function safeAlert_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    Logger.log(message);
  }
}

/** Hidden key/value config sheet - works even when DocumentProperties is null */
function ensureMetaSheet_(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.meta);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.meta);
    sheet.hideSheet();
    sheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
  }
  return sheet;
}

function setMeta_(ss, key, value) {
  var sheet = ensureMetaSheet_(ss);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) {
      sheet.getRange(i + 1, 2).setValue(String(value));
      return;
    }
  }
  sheet.appendRow([key, String(value)]);
}

function getMeta_(ss, key) {
  var sheet = ss.getSheetByName(SHEET_NAMES.meta);
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) {
      var v = data[i][1];
      return v === '' || v === null || typeof v === 'undefined' ? null : String(v);
    }
  }
  return null;
}

function getOrRecreateSheet_(ss, name, index) {
  var existing = ss.getSheetByName(name);
  if (existing) ss.deleteSheet(existing);
  return ss.insertSheet(name, index);
}

function removeUnusedSheets_(ss) {
  var keep = {};
  keep[SHEET_NAMES.daily] = true;
  keep[SHEET_NAMES.phrases] = true;
  keep[SHEET_NAMES.vocab] = true;
  keep[SHEET_NAMES.pron] = true;
  keep[SHEET_NAMES.trans] = true;
  keep[SHEET_NAMES.tasks] = true;
  keep[SHEET_NAMES.tracker] = true;
  keep[SHEET_NAMES.weekly] = true;
  keep[SHEET_NAMES.today] = true;
  keep[SHEET_NAMES.meta] = true;
  var toDelete = ss.getSheets().filter(function (s) {
    return !keep[s.getName()];
  });
  toDelete.forEach(function (s) {
    if (ss.getSheets().length > 1) {
      try { ss.deleteSheet(s); } catch (e) {}
    }
  });
}

function setLabeledAnswerCell_(range, text, labels) {
  var builder = SpreadsheetApp.newRichTextValue().setText(text);
  var bold = SpreadsheetApp.newTextStyle().setBold(true).build();
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    var start = text.indexOf(label);
    if (start >= 0) {
      builder.setTextStyle(start, start + label.length, bold);
    }
  }
  range
    .setRichTextValue(builder.build())
    .setFontFamily('Arial').setFontSize(10).setFontColor('#0F172A')
    .setBackground(THEME.aBg).setWrap(true).setVerticalAlignment('top');
}

function applyTitleBlock_(sheet, cols, title, subtitle) {
  var lastCol = String.fromCharCode(64 + cols);
  sheet.getRange('A1:' + lastCol + '1').merge();
  sheet.getRange('A1')
    .setValue(title)
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.navy)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);

  sheet.getRange('A2:' + lastCol + '2').merge();
  sheet.getRange('A2')
    .setValue(subtitle)
    .setFontFamily('Arial').setFontSize(10).setFontColor('#334155')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(2, 28);
}

function styleHeaderRow_(sheet, row, headers) {
  sheet.getRange(row, 1, 1, headers.length)
    .setValues([headers])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.slate)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(row, 28);
  sheet.setFrozenRows(row);
}

function styleStripedTable_(sheet, startRow, numRows, numCols, boldCol) {
  for (var i = 0; i < numRows; i++) {
    var r = startRow + i;
    sheet.getRange(r, 1, 1, numCols).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    if (boldCol) {
      sheet.getRange(r, boldCol).setFontWeight('bold').setFontColor(THEME.navy);
    }
  }
  sheet.getRange(startRow - 1, 1, numRows + 1, numCols)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

`;

const dataSection = `
// ================================================================
// DATA
// ================================================================
function getDailyData_() {
  return ${jsArrOfObjects(DAYS, ['day','level','phrase','context','hindi','word1','meaning1','example1','word2','meaning2','example2','transHindi','transEnglish','pronFocus','task','mono','listen','grammar','grammarEx','mistakeWrong','mistakeRight','mistakeWhy','realUse'])};
}

function getPhraseData_() {
  return ${jsArrOfObjects(PHRASES, ['level','day','phrase','context','hindi'])};
}

function getVocabData_() {
  return ${jsArrOfObjects(VOCAB, ['word','meaning','example','level'])};
}

function getPronunciationData_() {
  return ${jsArrOfArrays(PRONUNCIATION)};
}

function getTranslationData_() {
  return ${jsArrOfArrays(TRANS)};
}

function getSpeakingTaskData_() {
  return ${jsArrOfArrays(SPEAKING_TASKS)};
}

function getTodayWordsData_() {
  return ${jsArrOfObjects(TODAY_WORDS, ['word','meaning','example'])};
}

`;

const tabsSection = `
// ================================================================
// DAILY PLAN
// ================================================================
function createDailyPlan_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.daily, 0);
  sheet.setTabColor(THEME.accent);

  // Col A = Padh liya? (HAR question) | Col F = Minimize? (sirf level title)
  sheet.setColumnWidth(1, 90);
  sheet.setColumnWidth(2, 90);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 240);
  sheet.setColumnWidth(5, 260);
  sheet.setColumnWidth(6, 100);

  applyTitleBlock_(sheet, 6,
    'English Speaking — Daily Plan (90 Days)',
    'Padh liya? (A) har Day pe  |  Practice: Listening + Grammar + Mistake + Real-use + drills  |  Minimize? (F) = Level collapse'
  );
  styleHeaderRow_(sheet, 3, ['Padh liya?', 'Type', 'Content', 'Context / Meaning', 'Vocab / Drill', 'Minimize?']);

  var days = getDailyData_();
  var levels = [
    { id: 'L1', title: 'Level 1 — Kid Style (ELI10)  ·  Days 1–30', start: 1, end: 30, colorIdx: 0 },
    { id: 'L2', title: 'Level 2 — Everyday Conversation  ·  Days 31–60', start: 31, end: 60, colorIdx: 1 },
    { id: 'L3', title: 'Level 3 — Professional / Interview  ·  Days 61–90', start: 61, end: 90, colorIdx: 2 }
  ];

  var row = 4;
  var levelMeta = {};
  var dayRowMap = {};

  levels.forEach(function (lvl) {
    var titleRow = row;
    var topicBg = THEME.moduleColors[lvl.colorIdx];

    sheet.getRange(row, 1).setBackground(topicBg);
    sheet.getRange(row, 2, 1, 4).merge();
    sheet.getRange(row, 2)
      .setValue(lvl.title + '   ←  Minimize? right pe = collapse')
      .setFontFamily('Arial').setFontSize(12).setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(topicBg)
      .setVerticalAlignment('middle');

    var checkCell = sheet.getRange(row, 6);
    checkCell.insertCheckboxes();
    checkCell.setValue(false);
    checkCell.setBackground('#FEF3C7');
    checkCell.setHorizontalAlignment('center');
    checkCell.setVerticalAlignment('middle');
    checkCell.setNote('Minimize? Tick = poora Level hide. Untick = expand.');
    sheet.setRowHeight(row, 36);
    row++;

    var contentStart = row;
    var levelDays = days.filter(function (d) { return d.day >= lvl.start && d.day <= lvl.end; });

    levelDays.forEach(function (d) {
      dayRowMap[d.day] = row;

      var readCell = sheet.getRange(row, 1);
      readCell.insertCheckboxes();
      readCell.setValue(false);
      readCell.setBackground('#FEF3C7');
      readCell.setHorizontalAlignment('center');
      readCell.setVerticalAlignment('middle');
      readCell.setNote('Padh liya? Tick = yeh question/day practice ho gaya.');

      sheet.getRange(row, 2)
        .setValue('Day ' + d.day)
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor('#FFFFFF')
        .setBackground(d.level === 3 ? THEME.interview : THEME.mustKnow)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');

      sheet.getRange(row, 3)
        .setValue(d.phrase)
        .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
        .setFontColor(THEME.qFg).setBackground(THEME.qBg)
        .setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 4)
        .setValue(d.context + '\\n(Hindi: ' + d.hindi + ')')
        .setFontFamily('Arial').setFontSize(9).setFontColor('#854D0E')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 5)
        .setValue(d.word1 + ' — ' + d.meaning1 + '\\n' + d.word2 + ' — ' + d.meaning2)
        .setFontFamily('Arial').setFontSize(9).setFontColor('#334155')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 6)
        .setValue('L' + d.level)
        .setFontFamily('Arial').setFontSize(9).setFontColor('#334155')
        .setBackground(THEME.qBg)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');

      sheet.setRowHeight(row, 52);
      row++;

      var drill =
        'Speaking Task:\\n' + d.task + '\\n\\n' +
        'Listening (2-3 min):\\n' + d.listen + '\\n\\n' +
        'Grammar bite:\\n' + d.grammar + '\\nExamples: ' + d.grammarEx + '\\n\\n' +
        'Mistake of the day:\\nWrong: ' + d.mistakeWrong + '\\n→ Right: ' + d.mistakeRight + '\\nKyun: ' + d.mistakeWhy + '\\n\\n' +
        'Real-use today:\\n' + d.realUse + '\\n\\n' +
        'Translate karo (Hindi to English):\\n' + d.transHindi + '\\n→ ' + d.transEnglish + '\\n\\n' +
        'Pronunciation focus:\\n' + d.pronFocus + '\\n\\n' +
        '60-second topic:\\n' + d.mono + '\\n\\n' +
        'Examples: ' + d.example1 + ' / ' + d.example2;

      sheet.getRange(row, 1).setBackground(THEME.aBg);

      sheet.getRange(row, 2)
        .setValue('Practice')
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor(THEME.aTagFg).setBackground(THEME.aTagBg)
        .setHorizontalAlignment('center').setVerticalAlignment('top');

      sheet.getRange(row, 3, 1, 3).merge();
      setLabeledAnswerCell_(sheet.getRange(row, 3), drill, [
        'Speaking Task:',
        'Listening (2-3 min):',
        'Grammar bite:',
        'Mistake of the day:',
        'Real-use today:',
        'Translate karo (Hindi to English):',
        'Pronunciation focus:',
        '60-second topic:'
      ]);

      sheet.getRange(row, 6).setBackground(THEME.aBg);
      sheet.setRowHeight(row, 200);
      row++;

      sheet.getRange(row, 1, 1, 6).setBackground('#FFFFFF');
      sheet.setRowHeight(row, 6);
      row++;
    });

    var contentEnd = row - 1;
    levelMeta[lvl.id] = {
      titleRow: titleRow,
      contentStart: contentStart,
      contentEnd: contentEnd,
      checkA1: 'F' + titleRow
    };

    if (contentEnd >= contentStart) {
      try {
        sheet.getRange(contentStart, 1, contentEnd - contentStart + 1, 1).shiftRowGroupDepth(1);
      } catch (e) {}
    }
  });

  sheet.getRange(row, 1, 1, 6).merge();
  sheet.getRange(row, 1)
    .setValue('Legend: Col A Padh liya? = har question  |  Col F Minimize? = Level collapse  |  Practice = Listening+Grammar+Mistake+Real-use+drills')
    .setFontFamily('Arial').setFontSize(9).setFontColor(THEME.muted)
    .setBackground(THEME.rowOdd).setVerticalAlignment('middle');

  sheet.getRange(3, 1, Math.max(1, row - 3), 6)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  setMeta_(ss, 'EN_LEVEL_META', JSON.stringify(levelMeta));
  setMeta_(ss, 'EN_DAY_ROWS', JSON.stringify(dayRowMap));
}

// ================================================================
// PHRASE BANK
// ================================================================
function createPhraseBank_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.phrases, 1);
  sheet.setTabColor('#7C3AED');

  applyTitleBlock_(sheet, 5,
    'Phrase Bank — 90 starter phrases',
    'Level ke hisaab se phrases. Daily Plan se linked. Kab bolo + Hindi matlab.'
  );
  styleHeaderRow_(sheet, 3, ['Day', 'Level', 'Phrase', 'Kab bolo', 'Hindi matlab']);

  var data = getPhraseData_();
  var values = data.map(function (p) {
    return [p.day, 'L' + p.level, p.phrase, p.context, p.hindi];
  });
  var start = 4;
  sheet.getRange(start, 1, values.length, 5)
    .setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < values.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontColor(THEME.accentText);
    sheet.getRange(r, 3).setFontWeight('bold').setFontColor(THEME.navy);
    sheet.setRowHeight(r, 36);
  }

  sheet.setColumnWidth(1, 50);
  sheet.setColumnWidth(2, 50);
  sheet.setColumnWidth(3, 420);
  sheet.setColumnWidth(4, 280);
  sheet.setColumnWidth(5, 280);
  sheet.getRange(3, 1, values.length + 1, 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// VOCABULARY
// ================================================================
function createVocabulary_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.vocab, 2);
  sheet.setTabColor('#0369A1');

  applyTitleBlock_(sheet, 5,
    'Vocabulary — 180 words (2 per day)',
    'Naya word dikhe toh yahan meaning + example. Phir Daily Plan mein wapas jao aur bolo.'
  );
  styleHeaderRow_(sheet, 3, ['#', 'Word', 'Simple Meaning (Hinglish)', 'Example', 'Level']);

  var data = getVocabData_();
  var values = data.map(function (v, i) {
    return [i + 1, v.word, v.meaning, v.example, 'L' + v.level];
  });
  var start = 4;
  sheet.getRange(start, 1, values.length, 5)
    .setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < values.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontColor(THEME.accentText);
    sheet.getRange(r, 2).setFontWeight('bold').setFontColor(THEME.navy);
    sheet.getRange(r, 4).setFontColor('#0369A1');
    sheet.setRowHeight(r, 32);
  }

  sheet.setColumnWidth(1, 40);
  sheet.setColumnWidth(2, 140);
  sheet.setColumnWidth(3, 320);
  sheet.setColumnWidth(4, 360);
  sheet.setColumnWidth(5, 60);
  sheet.getRange(3, 1, values.length + 1, 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// PRONUNCIATION
// ================================================================
function createPronunciation_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.pron, 3);
  sheet.setTabColor('#B45309');

  applyTitleBlock_(sheet, 5,
    'Pronunciation — Indian-English focus drills',
    'Roz Daily Plan se linked focus practice karo. Clarity pehle, speed baad mein.'
  );
  styleHeaderRow_(sheet, 3, ['Sound', 'Kya galti hoti hai', 'Practice words', 'Practice sentence', 'Tip']);

  var data = getPronunciationData_();
  var start = 4;
  sheet.getRange(start, 1, data.length, 5)
    .setValues(data)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < data.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setFontWeight('bold').setFontColor(THEME.navy);
    sheet.setRowHeight(r, 48);
  }

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 260);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 240);
  sheet.getRange(3, 1, data.length + 1, 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// TRANSLATION DRILLS
// ================================================================
function createTranslationDrills_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.trans, 4);
  sheet.setTabColor('#BE123C');

  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 520);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 100);

  applyTitleBlock_(sheet, 4,
    'Translation Drills — Hindi → English (180)',
    'Amber = Hindi (pehle khud bolo). Mint = English answer. Speaking ke liye sabse high-ROI drill.'
  );
  styleHeaderRow_(sheet, 3, ['#', 'Sentence', 'Level', 'Type']);

  var data = getTranslationData_();
  var row = 4;
  for (var i = 0; i < data.length; i++) {
    var level = i < 60 ? 1 : i < 120 ? 2 : 3;

    sheet.getRange(row, 1)
      .setValue(i + 1)
      .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(THEME.interview)
      .setHorizontalAlignment('center');
    sheet.getRange(row, 2)
      .setValue(data[i][0])
      .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
      .setFontColor(THEME.qFg).setBackground(THEME.qBg)
      .setWrap(true);
    sheet.getRange(row, 3)
      .setValue('L' + level)
      .setBackground(THEME.qBg).setHorizontalAlignment('center');
    sheet.getRange(row, 4)
      .setValue('Hindi')
      .setBackground(THEME.qBg).setHorizontalAlignment('center');
    sheet.setRowHeight(row, 28);
    row++;

    sheet.getRange(row, 1)
      .setValue('EN')
      .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
      .setFontColor(THEME.aTagFg).setBackground(THEME.aTagBg)
      .setHorizontalAlignment('center');
    sheet.getRange(row, 2)
      .setValue(data[i][1])
      .setFontFamily('Arial').setFontSize(10)
      .setFontColor('#0F172A').setBackground(THEME.aBg)
      .setWrap(true);
    sheet.getRange(row, 3).setBackground(THEME.aBg);
    sheet.getRange(row, 4)
      .setValue('English')
      .setBackground(THEME.aBg).setHorizontalAlignment('center');
    sheet.setRowHeight(row, 28);
    row++;
  }

  sheet.getRange(3, 1, Math.max(1, row - 3), 4)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// SPEAKING TASKS
// ================================================================
function createSpeakingTasks_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.tasks, 5);
  sheet.setTabColor('#15803D');

  applyTitleBlock_(sheet, 5,
    'Speaking Tasks — drill library',
    'Monologue, roleplay, shadowing, interview. Duration + difficulty ke saath rotate karke use karo.'
  );
  styleHeaderRow_(sheet, 3, ['Name', 'Task', 'Duration', 'Difficulty', 'Category']);

  var data = getSpeakingTaskData_();
  var start = 4;
  sheet.getRange(start, 1, data.length, 5)
    .setValues(data)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < data.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setFontWeight('bold').setFontColor(THEME.navy);
    var diff = data[i][3];
    sheet.getRange(r, 4)
      .setBackground(diff === 1 ? THEME.accentSoft : diff === 2 ? '#FEF3C7' : '#FFEDD5')
      .setHorizontalAlignment('center');
    sheet.setRowHeight(r, 44);
  }

  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 480);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 90);
  sheet.setColumnWidth(5, 120);
  sheet.getRange(3, 1, data.length + 1, 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// PROGRESS TRACKER
// ================================================================
function createProgressTracker_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.tracker, 6);
  sheet.setTabColor('#0E7490');

  sheet.setColumnWidth(1, 60);
  sheet.setColumnWidth(2, 110);
  sheet.setColumnWidth(3, 70);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 220);
  sheet.setColumnWidth(7, 260);
  sheet.setColumnWidth(8, 160);

  applyTitleBlock_(sheet, 8,
    'Progress Tracker — 90 days',
    'Roz Mark Today Done (menu) ya checkbox tick. Summary formulas upar. Start date: English Practice → Set Start Date.'
  );

  // Summary row (row 3) then headers on row 4 — freeze 4
  sheet.getRange('A3').setValue('SUMMARY');
  sheet.getRange('B3').setValue('Days done →');
  sheet.getRange('C3').setFormula('=COUNTIF(C5:C94,TRUE)');
  sheet.getRange('D3').setValue('Avg rating →');
  sheet.getRange('E3').setFormula('=IFERROR(ROUND(AVERAGE(E5:E94),1),"—")');
  sheet.getRange('F3').setValue('Streak (unbroken from Day 1) →');
  sheet.getRange('G3').setFormula(
    '=IFERROR(MATCH(FALSE,C5:C94,0)-1,IF(COUNTIF(C5:C94,TRUE)=90,90,0))'
  );
  sheet.getRange('H3').setValue('');
  sheet.getRange('A3:H3')
    .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);

  styleHeaderRow_(sheet, 4, ['Day', 'Date', 'Done?', 'Minutes', 'Rating 1-5', 'Recording link', 'Notes', 'Level']);

  var startDateStr = getMeta_(ss, 'EN_START_DATE');
  var startDate = startDateStr ? new Date(startDateStr + 'T00:00:00') : new Date();

  var values = [];
  for (var d = 1; d <= 90; d++) {
    var dt = new Date(startDate.getTime());
    dt.setDate(dt.getDate() + (d - 1));
    var dateLabel = Utilities.formatDate(dt, Session.getScriptTimeZone(), 'dd-MMM-yyyy');
    var level = d <= 30 ? 'L1' : d <= 60 ? 'L2' : 'L3';
    values.push([d, dateLabel, false, '', '', '', '', level]);
  }

  var start = 5;
  sheet.getRange(start, 1, 90, 8).setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setVerticalAlignment('middle');

  sheet.getRange(start, 3, 90, 1).insertCheckboxes();
  sheet.getRange(start, 5, 90, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['1', '2', '3', '4', '5'], true).build()
  );

  for (var i = 0; i < 90; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 8).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontColor(THEME.accentText);
    sheet.getRange(r, 3).setHorizontalAlignment('center');
    sheet.getRange(r, 5).setHorizontalAlignment('center');
  }

  // Conditional formatting: Done=true → mint row
  var doneRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$C5=TRUE')
    .setBackground(THEME.aBg)
    .setRanges([sheet.getRange(start, 1, 90, 8)])
    .build();
  // High rating highlight
  var ratingRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(4)
    .setBackground(THEME.accentSoft)
    .setRanges([sheet.getRange(start, 5, 90, 1)])
    .build();
  sheet.setConditionalFormatRules([doneRule, ratingRule]);

  sheet.getRange(4, 1, 91, 8)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  setMeta_(ss, 'EN_TRACKER_START_ROW', String(start));
}

// ================================================================
// WEEKLY REVIEW (13 weeks)
// ================================================================
function createWeeklyReview_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.weekly, 7);
  sheet.setTabColor('#7C3AED');

  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 60);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 420);
  sheet.setColumnWidth(5, 320);
  sheet.setColumnWidth(6, 200);
  sheet.setColumnWidth(7, 200);

  applyTitleBlock_(sheet, 7,
    'Weekly Review — 13 weeks (Days 1–90)',
    'Har week end: 7 phrases zor se revise + 2-min recording + 1 weak sound note. Done? pe tick.'
  );
  styleHeaderRow_(sheet, 3, ['Done?', 'Week', 'Days', 'Revise these phrases', 'Checklist', 'Recording link', 'Notes']);

  var days = getDailyData_();
  var values = [];
  for (var w = 0; w < 13; w++) {
    var startDay = w * 7 + 1;
    var endDay = Math.min(startDay + 6, 90);
    var phrases = [];
    for (var d = startDay; d <= endDay; d++) {
      phrases.push('D' + d + ': ' + days[d - 1].phrase);
    }
    values.push([
      false,
      'W' + (w + 1),
      startDay + '–' + endDay,
      phrases.join(' | '),
      '1) 7 phrases aloud revise  2) 2-min recording (week summary)  3) Note 1 weak sound',
      '',
      ''
    ]);
  }

  var start = 4;
  sheet.getRange(start, 1, values.length, 7)
    .setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');
  sheet.getRange(start, 1, values.length, 1).insertCheckboxes();

  for (var i = 0; i < values.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 7).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setBackground('#FEF3C7').setHorizontalAlignment('center');
    sheet.getRange(r, 2).setFontWeight('bold').setFontColor(THEME.navy).setHorizontalAlignment('center');
    sheet.setRowHeight(r, 72);
  }

  sheet.getRange(3, 1, values.length + 1, 7)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// TODAY WORDS (inbox — today-words.txt se + sheet pe empty rows)
// ================================================================
function createTodayWords_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.today, 8);
  sheet.setTabColor('#BE123C');

  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 320);
  sheet.setColumnWidth(4, 360);
  sheet.setColumnWidth(5, 160);

  applyTitleBlock_(sheet, 5,
    'Today Words — personal inbox',
    'Naya word dikhe → today-words.txt mein add karo OR yahan khali row mein type karo. Done? = seekh liya.'
  );
  styleHeaderRow_(sheet, 3, ['Done?', 'Word', 'Meaning (Hinglish)', 'Example', 'Added']);

  var data = getTodayWordsData_();
  var todayLabel = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd-MMM-yyyy');
  var values = data.map(function (w) {
    return [false, w.word, w.meaning, w.example, todayLabel];
  });

  // Extra blank rows so you can type new words directly in the sheet
  for (var b = 0; b < 25; b++) {
    values.push([false, '', '', '', '']);
  }

  var start = 4;
  if (values.length > 0) {
    sheet.getRange(start, 1, values.length, 5)
      .setValues(values)
      .setFontFamily('Arial').setFontSize(10)
      .setWrap(true).setVerticalAlignment('middle');
    sheet.getRange(start, 1, values.length, 1).insertCheckboxes();

    for (var i = 0; i < values.length; i++) {
      var r = start + i;
      sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
      sheet.getRange(r, 1).setBackground('#FEF3C7').setHorizontalAlignment('center');
      if (values[i][1]) {
        sheet.getRange(r, 2).setFontWeight('bold').setFontColor(THEME.navy);
      }
      sheet.setRowHeight(r, 28);
    }

    sheet.getRange(3, 1, values.length + 1, 5)
      .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
  }
}

// ================================================================
// INTERACTIONS - collapse / today / start date
// ================================================================
function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAMES.daily) return;
  // Col F (6) = Minimize? level collapse only; Col A = Padh liya? per question
  if (e.range.getColumn() !== 6) return;

  var checked = e.range.getValue() === true;
  var editedRow = e.range.getRow();
  var meta = getLevelMeta_();

  var levelId = null;
  Object.keys(meta).forEach(function (id) {
    if (meta[id].titleRow === editedRow) levelId = id;
  });
  if (!levelId) return;

  if (checked) collapseLevelById_(levelId);
  else expandLevelById_(levelId);
}

function getLevelMeta_() {
  try {
    var ss = getSpreadsheet_();
    return JSON.parse(getMeta_(ss, 'EN_LEVEL_META') || '{}');
  } catch (e) {
    return {};
  }
}

function collapseLevelById_(levelId) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.daily);
  var meta = getLevelMeta_();
  var m = meta[levelId];
  if (!sheet || !m) {
    safeAlert_('Level ' + levelId + ' range not found. Run setup() again.');
    return;
  }
  sheet.hideRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.collapse();
  } catch (err) {}
}

function expandLevelById_(levelId) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.daily);
  var meta = getLevelMeta_();
  var m = meta[levelId];
  if (!sheet || !m) {
    safeAlert_('Level ' + levelId + ' range not found. Run setup() again.');
    return;
  }
  sheet.showRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.expand();
  } catch (err) {}
}

function syncLevelCheckbox_(levelId, checked) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.daily);
  var meta = getLevelMeta_();
  var m = meta[levelId];
  if (!sheet || !m) return;
  sheet.getRange(m.titleRow, 6).setValue(!!checked);
}

function collapseLevel1() { collapseLevelById_('L1'); syncLevelCheckbox_('L1', true); }
function expandLevel1() { expandLevelById_('L1'); syncLevelCheckbox_('L1', false); }
function collapseLevel2() { collapseLevelById_('L2'); syncLevelCheckbox_('L2', true); }
function expandLevel2() { expandLevelById_('L2'); syncLevelCheckbox_('L2', false); }
function collapseLevel3() { collapseLevelById_('L3'); syncLevelCheckbox_('L3', true); }
function expandLevel3() { expandLevelById_('L3'); syncLevelCheckbox_('L3', false); }

function getStartDate_() {
  var ss = getSpreadsheet_();
  var s = getMeta_(ss, 'EN_START_DATE');
  if (!s) {
    s = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    setMeta_(ss, 'EN_START_DATE', s);
  }
  return new Date(s + 'T00:00:00');
}

function getTodayDayNumber_() {
  var start = getStartDate_();
  var now = new Date();
  var startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var diff = Math.floor((today - startDay) / (24 * 60 * 60 * 1000)) + 1;
  if (diff < 1) return 1;
  if (diff > 90) return 90;
  return diff;
}

function goToToday() {
  var day = getTodayDayNumber_();
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.daily);
  if (!sheet) {
    safeAlert_('Daily Plan tab missing. Run setup().');
    return;
  }

  var dayRows;
  try {
    dayRows = JSON.parse(getMeta_(ss, 'EN_DAY_ROWS') || '{}');
  } catch (e) {
    dayRows = {};
  }
  var targetRow = dayRows[String(day)] || dayRows[day];
  if (!targetRow) {
    safeAlert_('Day ' + day + ' row not found. Run setupDailyPlan().');
    return;
  }

  sheet.getRange(targetRow, 1, 2, 6).setBorder(
    true, true, true, true, true, true, THEME.accent, SpreadsheetApp.BorderStyle.SOLID_THICK
  );
  sheet.setActiveRange(sheet.getRange(targetRow, 1));
  try { ss.toast('Aaj Day ' + day + ' - practice yahan se!', 'English Practice'); } catch (e) {}
}

function markTodayDone() {
  var day = getTodayDayNumber_();
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.tracker);
  if (!sheet) {
    safeAlert_('Progress Tracker missing. Run setupTracker().');
    return;
  }
  var startRow = parseInt(getMeta_(ss, 'EN_TRACKER_START_ROW') || '5', 10);
  var row = startRow + day - 1;
  sheet.getRange(row, 3).setValue(true);
  if (!sheet.getRange(row, 4).getValue()) {
    sheet.getRange(row, 4).setValue(10);
  }
  try {
    ss.setActiveSheet(sheet);
    sheet.setActiveRange(sheet.getRange(row, 1));
    ss.toast('Day ' + day + ' marked done!', 'Progress');
  } catch (e) {}
}

function setStartDate() {
  var ss = getSpreadsheet_();
  var ui;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {
    safeAlert_('UI not available. Set EN_START_DATE in _Meta sheet manually (yyyy-MM-dd).');
    return;
  }
  var current = getMeta_(ss, 'EN_START_DATE') || '';
  var response = ui.prompt(
    'Set Start Date',
    'yyyy-MM-dd format (current: ' + current + '). Tracker dates regenerate.',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  var text = (response.getResponseText() || '').trim();
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(text)) {
    ui.alert('Sahi format: yyyy-MM-dd (e.g. 2026-09-14)');
    return;
  }
  var parsed = new Date(text + 'T00:00:00');
  if (isNaN(parsed.getTime())) {
    ui.alert('Invalid date.');
    return;
  }
  setMeta_(ss, 'EN_START_DATE', text);
  createProgressTracker_(ss);
  ui.alert('Start date set to ' + text + '. Progress Tracker dates updated.');
}

/** Optional time-driven trigger target - only highlights today, does NOT append rows */
function highlightTodayRow() {
  goToToday();
}
`;

const out = header + dataSection + tabsSection;
const outPath = path.join(__dirname, 'Create_English_Speaking_Sheet.gs');
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath, 'bytes=', out.length);
console.log('Days', DAYS.length, 'Phrases', PHRASES.length, 'Vocab', VOCAB.length, 'Trans', TRANS.length);
console.log('Pron', PRONUNCIATION.length, 'Tasks', SPEAKING_TASKS.length);
console.log('TodayWords', TODAY_WORDS.length);
