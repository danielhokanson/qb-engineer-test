# Onboarding Tutorial

This is the first thing a tester runs. It teaches three things: how to read a test case, how to record a result honestly, and what testing discipline looks like in practice. None of the steps touch the actual application under test — they all happen inside a small built-in practice screen.

## What the runner needs to provide

The runner must include a built-in **Practice Screen** with this layout:

- A heading: "Practice App"
- A counter starting at 0, displayed in large text
- Three buttons: **Add 1**, **Subtract 1**, **Reset**
- A text input labeled "Your name"
- A button labeled **Greet me**
- A read-only output area below the button
- A toggle labeled "Show double" — when on, the counter also displays as `(×2 = N)` next to the main number
- A button labeled **Crash on purpose** that, when clicked, displays a deliberately wrong result (counter shows `BANANA` instead of a number) — this is for the tutorial's "spot the bug" case

This screen is intentionally simple, fully self-contained, never changes between releases, and cannot affect anything outside itself.

## Notes on tone

The tutorial is allowed to be a little chatty and explanatory. Real test cases are not. Once the tester finishes the tutorial they should expect the real cases to be terser, more concrete, and to assume they remember what they just learned.

---

## TUT-001 — How to read a step

```yaml
id: TUT-001
title: How to read a test step
goal: |
  Learn what an "action" is, what an "expected result" is, and the
  difference between them. This is the most important habit in
  testing — never skip checking the expected result.
preconditions:
  - The Practice App screen is open.
  - The counter shows 0.
steps:
  - n: 1
    action: |
      Read the next two lines carefully before doing anything.
    expected: |
      You read the lines. (You really did, right?)
    notes: |
      Every test step has TWO parts. The "action" tells you what to do.
      The "expected" tells you what should happen. You always check the
      expected against what you actually see. If they don't match, that
      is a bug — even if it seems small.
  - n: 2
    action: |
      Click the "Add 1" button one time.
    expected: |
      The counter now shows 1.
  - n: 3
    action: |
      Click "Add 1" two more times.
    expected: |
      The counter now shows 3.
expected_overall: |
  You clicked Add 1 three times and the counter ended on 3.
pass_criteria: |
  The counter shows 3 after three clicks.
why_this_matters: |
  In real cases the action and expected won't be this obvious. You'll
  click something and you have to actually look at the screen to verify
  what happened. The habit of reading expected, doing the action, and
  comparing — that habit is the whole job.
est_minutes: 2
```

---

## TUT-002 — Recording a pass

```yaml
id: TUT-002
title: How to record a passing result
goal: |
  Practice marking a case as passed. The runner stores your result
  locally so you can resume later or see what you've already done.
preconditions:
  - You completed TUT-001.
  - The counter shows 3 (from the previous case).
steps:
  - n: 1
    action: |
      Click "Reset" to set the counter back to 0.
    expected: |
      The counter now shows 0.
  - n: 2
    action: |
      Click "Subtract 1" once.
    expected: |
      The counter now shows -1.
  - n: 3
    action: |
      When everything matches what was expected, mark this case as
      "Passed" using the runner's controls.
    expected: |
      The case is recorded as passed. The case list shows a checkmark
      or similar indicator next to TUT-002.
expected_overall: |
  The counter went 0, -1, and you marked the case passed in the runner.
pass_criteria: |
  The counter behaved correctly AND the runner recorded a pass.
notes: |
  Yes — passing a case is itself a step. Don't forget to actually click
  the "Pass" button. A case nobody marked is a case nobody ran.
est_minutes: 2
```

---

## TUT-003 — Recording a fail

```yaml
id: TUT-003
title: How to record a failing result and write a useful note
goal: |
  Practice marking a case as failed. Practice writing a note about the
  failure that someone else can read later and understand without
  asking you questions.
preconditions:
  - You completed TUT-002.
  - The Practice App is visible.
steps:
  - n: 1
    action: |
      Click the button labeled "Crash on purpose."
    expected: |
      The counter shows a number (any number).
  - n: 2
    action: |
      Look at the counter. Compare what you actually see to the
      expected result above.
    expected: |
      You notice the counter is showing something that is not a
      number.
  - n: 3
    action: |
      Mark this case as "Failed." When the runner asks for a note,
      write what you actually saw. Be specific. "The counter showed
      the word BANANA instead of a number after I clicked Crash on
      purpose." Don't write "it broke."
    expected: |
      The case is recorded as failed with your note attached.
expected_overall: |
  You correctly identified that the actual result didn't match the
  expected result, marked the case as failed, and wrote a note that a
  developer could read tomorrow and understand without talking to you.
pass_criteria: |
  Case is recorded as failed AND the note describes what was seen
  (not just "doesn't work").
why_this_matters: |
  Most bug reports that bounce back to the tester do so because the
  note doesn't say what was actually seen. "Login is broken" gets
  ignored. "After clicking Sign In with valid credentials, the page
  showed a blank white screen for 30 seconds, then returned to the
  login form with no error message" gets fixed.
est_minutes: 4
```

---

## TUT-004 — Don't assume

```yaml
id: TUT-004
title: When to write a bug versus when to assume it's intended
goal: |
  Learn the discipline that "if expected says X and you see Y, you
  write a bug." You don't decide on your own that Y is fine. You
  don't ask the developer first. You write what you saw.
preconditions:
  - You completed TUT-003.
  - The Practice App is visible.
steps:
  - n: 1
    action: |
      Click "Reset" so the counter shows 0.
    expected: |
      The counter shows 0.
  - n: 2
    action: |
      Turn on the "Show double" toggle.
    expected: |
      Next to the counter, you see "(×2 = 0)".
  - n: 3
    action: |
      Click "Add 1" five times.
    expected: |
      The counter shows 5. Next to it, you see "(×2 = 10)".
  - n: 4
    action: |
      Click "Subtract 1" twice.
    expected: |
      The counter shows 3. Next to it, you see "(×2 = 6)".
expected_overall: |
  At every step the doubled value matches what doubling the counter
  should be.
pass_criteria: |
  The doubled value was correct after every click in steps 2 through 4.
notes: |
  If at any point the doubled value was wrong — even by a little, even
  if the regular counter was right — that is a bug. Mark the case
  failed and describe exactly what you saw at which step. Don't decide
  it's a rounding issue or "close enough." Your job is to compare
  expected to actual and report. The developer's job is to decide
  what counts as a real problem.
est_minutes: 3
```

---

## TUT-005 — Reading preconditions

```yaml
id: TUT-005
title: Why preconditions matter
goal: |
  Learn that a case may assume specific state before it starts. If
  the state isn't right, you can't run the case yet — or your
  results won't mean anything.
preconditions:
  - The Practice App is visible.
  - The counter shows exactly 7. (You'll need to set this up.)
  - The "Show double" toggle is OFF.
steps:
  - n: 1
    action: |
      Before doing anything else, set up the precondition state. Click
      Reset, then click "Add 1" seven times. Make sure "Show double" is
      off.
    expected: |
      Counter shows 7. No "(×2 = N)" displayed next to it.
  - n: 2
    action: |
      Now click "Subtract 1" three times.
    expected: |
      The counter shows 4.
  - n: 3
    action: |
      Click "Add 1" once.
    expected: |
      The counter shows 5.
expected_overall: |
  You set the system to the precondition state first, then ran the
  case. The final counter is 5.
pass_criteria: |
  Counter shows 5 at the end AND you set up the preconditions before
  running the steps (not after).
notes: |
  In real cases the preconditions might be "Customer ACME-001 exists
  and has an open sales order." If those aren't true, the steps won't
  make sense. The runner will sometimes let you skip ahead by setting
  up state automatically — but you, the tester, should always read the
  preconditions first to know what the case assumes.
why_this_matters: |
  A case that "fails" because the preconditions weren't met is not a
  real bug. It just means the test wasn't really run. Get in the habit
  of checking preconditions before starting steps.
est_minutes: 3
```

---

## TUT-006 — Pacing and breaks

```yaml
id: TUT-006
title: Take breaks, the runner remembers
goal: |
  Learn that you can stop in the middle of a session and the runner
  will pick up where you left off. There is no penalty for going slow
  or splitting work across days.
preconditions:
  - You've completed TUT-001 through TUT-005.
steps:
  - n: 1
    action: |
      Look at the case list. Note how the cases you've completed are
      marked.
    expected: |
      TUT-001 through TUT-005 are marked as passed (or failed, if you
      genuinely encountered an issue).
  - n: 2
    action: |
      Close the runner entirely. Close the browser tab. Walk away for
      at least one minute.
    expected: |
      The runner is closed.
  - n: 3
    action: |
      Reopen the runner.
    expected: |
      The runner remembers your previous session. The completed cases
      are still marked. You can pick up at TUT-006 (this case) without
      redoing anything.
  - n: 4
    action: |
      Mark this case as passed.
    expected: |
      The runner records the pass. You've completed the tutorial.
expected_overall: |
  The runner correctly remembered your prior progress after a full
  close and reopen.
pass_criteria: |
  Prior pass/fail records were preserved across closing and reopening
  the runner.
notes: |
  Real test sessions often span multiple sittings. A full Phase 0
  cold-start might take half a day. You are not expected to do it in
  one go. The runner stores your progress on this device — don't switch
  computers mid-session unless you're prepared to start over or
  manually transfer your data.
est_minutes: 3
```

---

## End of tutorial

After TUT-006, the runner displays a summary: how many tutorial cases passed, how many failed, total time. Then it offers to start the real test suite.

Recommended next: the cold-start scenario manifest, beginning with Phase 0.
