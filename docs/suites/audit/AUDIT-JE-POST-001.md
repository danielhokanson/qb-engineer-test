## AUDIT-JE-POST-001 — Manual JE posting is logged with status change

```yaml
id: AUDIT-JE-POST-001
title: Posting a draft JE records actor, status change, and GL effect
goal: |
  Verify that posting a draft manual JE records actor, timestamp,
  prior status (draft), new status (posted), and confirms the GL
  effect is in place.
roles:
  - Controller
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A balanced draft manual JE exists.
prerequisite_cases:
  - AUDIT-JE-CREATE-001
steps:
  - n: 1
    action: |
      Post the draft JE.
    expected: |
      JE transitions to posted. GL effect takes hold.
  - n: 2
    action: |
      Open the JE's audit log.
    expected: |
      Posting entry shows actor, timestamp, prior status, new status,
      and a reference to the resulting GL journal lines.
expected_overall: |
  JE posting is fully attributed and tied to GL.
pass_criteria: |
  Posting entry present AND captures status diff and GL reference.
est_minutes: 4
```
