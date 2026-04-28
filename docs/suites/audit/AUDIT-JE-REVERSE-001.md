## AUDIT-JE-REVERSE-001 — JE reversal is logged

```yaml
id: AUDIT-JE-REVERSE-001
title: Reversing a posted JE records actor and links the reversal entry
goal: |
  Verify that reversing a posted manual JE records actor, timestamp,
  reason, and creates a linked reversing JE. The original JE remains
  visible and unchanged.
roles:
  - Controller
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A posted manual JE exists in an open period.
prerequisite_cases:
  - AUDIT-JE-POST-001
steps:
  - n: 1
    action: |
      Reverse the posted JE in the same or a later open period.
      Provide a reason if prompted.
    expected: |
      A reversing JE is created and posted.
  - n: 2
    action: |
      Open the original JE's audit log.
    expected: |
      Reversal entry shows actor, timestamp, reason, and a link to the
      reversing JE. Original entry is unchanged.
  - n: 3
    action: |
      Open the reversing JE.
    expected: |
      Reversing JE references the original JE and contains opposite
      debit / credit values.
expected_overall: |
  JE reversals preserve the original record and link the two entries.
pass_criteria: |
  Reversal entry present with attribution AND link between original
  and reversing JE is bidirectional AND original is unchanged.
est_minutes: 5
```
