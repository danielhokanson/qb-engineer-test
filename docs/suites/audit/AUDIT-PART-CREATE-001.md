## AUDIT-PART-CREATE-001 — New part creation is logged

```yaml
id: AUDIT-PART-CREATE-001
title: Creating a part records actor, target, and initial attributes
goal: |
  Verify that creating a new part (raw, WIP, or finished) logs actor,
  timestamp, target part number, and the initial attributes.
roles:
  - Engineer / R&D
  - Administrator
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A user with permission to create parts exists.
steps:
  - n: 1
    action: |
      Create a new part with part number, description, type
      (raw / WIP / finished), unit of measure, and standard cost. Save.
    expected: |
      Part saves successfully.
  - n: 2
    action: |
      Open the audit log filtered to part / item-master events.
    expected: |
      Creation entry shows actor, timestamp, target part number, and
      the initial attribute values as the "after" state.
expected_overall: |
  Part creation is fully attributed.
pass_criteria: |
  Creation entry present AND captures actor, timestamp, target, and
  initial attribute values.
est_minutes: 4
```
