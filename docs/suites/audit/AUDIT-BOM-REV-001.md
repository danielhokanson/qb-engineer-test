## AUDIT-BOM-REV-001 — BOM revisions show what changed

```yaml
id: AUDIT-BOM-REV-001
title: A BOM revision records what changed (line, qty, alternate)
goal: |
  Verify that creating a BOM revision logs the change in detail —
  which lines, what changed, prior values, new values, and the actor.
roles:
  - Engineer / R&D
preconditions:
  - A finished part has a released BOM (P2-BOM-001).
prerequisite_cases:
  - P2-BOM-001
steps:
  - n: 1
    action: |
      Open the BOM. Change one component quantity. Add an alternate.
      Save.
    expected: |
      A new revision is created.
  - n: 2
    action: |
      Open the BOM history / audit log for this part.
    expected: |
      The revision entry shows: actor, timestamp, the prior
      revision's line values, the new revision's line values, and
      a summary of what changed.
expected_overall: |
  BOM revisions surface a real diff, not just a "modified" flag.
pass_criteria: |
  Revision history shows changed lines with before/after values.
est_minutes: 5
```
