## NOTIF-AR-AGING-003 — AR aging digest summarizes overdue invoices per recipient

```yaml
id: NOTIF-AR-AGING-003
title: AR aging digest delivers one summary per recipient on the documented schedule
goal: |
  Verify that recipients subscribed to the AR aging digest (e.g., daily
  or weekly summary) receive one consolidated email listing all their
  in-scope overdue invoices, instead of one notification per invoice.
roles:
  - Controller
  - Sales / Account Manager
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-O2C-COLLECTIONS
preconditions:
  - At least one customer has multiple invoices in past-due buckets
    assigned to a recipient configured for digest mode.
prerequisite_cases:
  - P4-INV-001
  - NOTIF-AR-AGING-001
steps:
  - n: 1
    action: |
      Confirm the recipient is in digest mode. Trigger or wait for the
      next scheduled digest.
    expected: |
      The recipient receives one summary email listing each overdue
      invoice with bucket, amount, and customer.
  - n: 2
    action: |
      Apply payment to one of the listed invoices. Trigger the next
      digest.
    expected: |
      The paid invoice is no longer in the digest. Remaining invoices
      still listed correctly.
  - n: 3
    action: |
      Switch the recipient to per-event mode and back. Verify next
      delivery matches the chosen mode.
    expected: |
      Per-event mode delivers individual notifications; digest mode
      consolidates.
expected_overall: |
  Digest mode is honored end-to-end for AR aging.
pass_criteria: |
  Digest contains all in-scope invoices AND excludes paid AND mode
  switches take effect on the next delivery.
est_minutes: 9
```
