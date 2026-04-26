## RPT-ARAGE-001 — AR aging detail buckets ties to open-invoice register

```yaml
id: RPT-ARAGE-001
title: AR aging detail buckets reconcile to open-invoice balances and bucket-level cuts
goal: |
  Run the AR aging detail report (current, 1-30, 31-60, 61-90, 90+).
  Verify each bucket equals the sum of open invoices whose age (as
  of the report date) falls in that bucket, and the grand total
  equals the AR control balance.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - At least one open invoice exists in each of three buckets
    (current, 1-30, 90+) so bucket cuts are exercised.
  - The AR control account balance is visible from the trial balance.
prerequisite_cases:
  - P4-INV-001
  - P5-CLOSE-002
steps:
  - n: 1
    action: |
      Run the AR aging detail report as of the close date.
    expected: |
      Report renders with per-customer rows, per-invoice detail, and
      bucket columns.
  - n: 2
    action: |
      Pull the open-invoice register as of the same date. For each
      open invoice, compute age = (report date - invoice due date).
      Place each invoice in its bucket and sum.
    expected: |
      Per-bucket totals computed.
  - n: 3
    action: |
      Compare to the report's bucket totals.
    expected: |
      Match within $0.01 per bucket.
  - n: 4
    action: |
      Sum all bucket totals. Compare to the AR control balance from
      the trial balance.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Spot-check an invoice exactly on a bucket boundary (e.g., due
      date = 30 days before report date). Confirm it falls in the
      correct bucket per the documented rule (1-30 vs. 31-60).
    expected: |
      Boundary placement matches the documented bucket rule.
expected_overall: |
  Aging buckets reconcile to invoice ages and grand total equals
  the AR control balance.
pass_criteria: |
  Per-bucket totals match within $0.01 AND grand total = AR control
  within $0.01 AND boundary invoice placed per the documented rule.
why_this_matters: |
  Aging is the basis of collections priority and bad-debt reserves.
  Mis-bucketed invoices distort both. The boundary check catches
  off-by-one bugs that hide in the middle of a normal aging.
est_minutes: 12
```
