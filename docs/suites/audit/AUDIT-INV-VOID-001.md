## AUDIT-INV-VOID-001 — Invoice void is logged with reversal reference

```yaml
id: AUDIT-INV-VOID-001
title: Voiding a posted invoice records actor, reason, and reversing entries
goal: |
  Verify that voiding a posted customer invoice records actor,
  timestamp, void reason, and a reference to the reversing GL postings.
  The original invoice and its postings remain visible.
roles:
  - AR Clerk
  - Controller
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A posted, unpaid customer invoice exists.
prerequisite_cases:
  - AUDIT-INV-POST-001
steps:
  - n: 1
    action: |
      Void the invoice. Provide a reason if prompted.
    expected: |
      Invoice transitions to voided. Reversing GL postings are produced.
  - n: 2
    action: |
      Open the invoice's audit log.
    expected: |
      Void entry shows actor, timestamp, reason text, and a reference
      to the reversing GL journal lines. The original posting entry is
      still present, unchanged.
expected_overall: |
  Voids preserve the original audit trail and add a reversal entry on
  top.
pass_criteria: |
  Void entry present with attribution and GL reversal reference AND
  original posting entry still present.
est_minutes: 5
```
