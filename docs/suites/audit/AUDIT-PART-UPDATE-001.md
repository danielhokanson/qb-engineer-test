## AUDIT-PART-UPDATE-001 — Part attribute updates record before / after

```yaml
id: AUDIT-PART-UPDATE-001
title: Updating a part's description and UoM is logged with diff
goal: |
  Verify that updating a part's description and unit of measure records
  each changed field with prior and new values, actor, and timestamp.
roles:
  - Engineer / R&D
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active part exists.
prerequisite_cases:
  - AUDIT-PART-CREATE-001
steps:
  - n: 1
    action: |
      Open the part. Change the description. Change the unit of measure.
      Save.
    expected: |
      Changes save.
  - n: 2
    action: |
      Open the part's audit log.
    expected: |
      Update entry shows actor, timestamp, and a diff with prior and
      new values for each changed field.
expected_overall: |
  Part field updates produce a clear field-level diff.
pass_criteria: |
  Both changed fields show prior and new values AND unchanged fields
  are not listed.
est_minutes: 4
```
