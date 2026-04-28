## AUDIT-PAY-REVERSE-001 — Payment reversal is logged

```yaml
id: AUDIT-PAY-REVERSE-001
title: Reversing an applied customer payment records actor and reversal entries
goal: |
  Verify that reversing a previously-applied customer payment (e.g.,
  NSF return) records actor, timestamp, reason, and a reference to the
  reversing GL postings. The original payment record remains visible.
roles:
  - AR Clerk
  - Controller
capabilities:
  - CAP-O2C-CASH
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - An applied customer payment exists.
prerequisite_cases:
  - AUDIT-PAY-APPLY-001
steps:
  - n: 1
    action: |
      Reverse the payment. Provide a reason if prompted.
    expected: |
      Payment is reversed. Affected invoices return to their prior open
      balance. Reversing GL postings are produced.
  - n: 2
    action: |
      Open the payment's audit log.
    expected: |
      Reversal entry shows actor, timestamp, reason, and a reference
      to the reversing GL journal lines. Original application entry
      is still present, unchanged.
expected_overall: |
  Payment reversals preserve the original record and produce a clear
  reversal trail.
pass_criteria: |
  Reversal entry present with attribution and GL reversal reference
  AND original application entry still present.
est_minutes: 5
```
