## AUDIT-SO-UPDATE-001 — Sales order line edits record before / after

```yaml
id: AUDIT-SO-UPDATE-001
title: Editing a confirmed SO's quantity and ship date is logged with diff
goal: |
  Verify that editing a confirmed sales order's line quantity and
  requested ship date records each change with prior and new values,
  actor, and timestamp.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-O2C-SO
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A confirmed SO exists with at least one line and a ship date.
prerequisite_cases:
  - AUDIT-SO-CREATE-001
steps:
  - n: 1
    action: |
      Open the SO. Change one line's quantity. Change the requested
      ship date. Save.
    expected: |
      Changes save.
  - n: 2
    action: |
      Open the SO's audit log.
    expected: |
      Update entry shows actor, timestamp, and a diff for each changed
      field with prior and new values.
expected_overall: |
  SO line edits produce a real field-level diff.
pass_criteria: |
  Both changed fields show prior and new values AND attribution is
  captured.
est_minutes: 4
```
