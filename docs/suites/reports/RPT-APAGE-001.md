## RPT-APAGE-001 — AP aging detail buckets ties to open vendor-invoice register

```yaml
id: RPT-APAGE-001
title: AP aging detail buckets reconcile to open vendor-invoice balances
goal: |
  Run the AP aging detail (current, 1-30, 31-60, 61-90, 90+).
  Verify each bucket equals the sum of open vendor invoices whose
  age (as of the report date) falls in that bucket, and the grand
  total equals the AP control balance.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-P2P-PO
  - CAP-ACCT-FULLGL
preconditions:
  - At least one open vendor invoice exists in each of three buckets
    (current, 1-30, 60+) so bucket cuts are exercised.
  - The AP control account balance is visible from the trial balance.
prerequisite_cases:
  - P3-AP-001
  - P5-CLOSE-002
steps:
  - n: 1
    action: |
      Run the AP aging detail report as of the close date.
    expected: |
      Report renders with per-vendor rows, per-invoice detail, and
      bucket columns.
  - n: 2
    action: |
      Pull the open vendor-invoice register as of the same date.
      Compute age = (report date - due date) per invoice and bucket.
    expected: |
      Per-bucket totals computed.
  - n: 3
    action: |
      Compare to the report's bucket totals.
    expected: |
      Match within $0.01 per bucket.
  - n: 4
    action: |
      Sum all buckets. Compare to AP control balance.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Spot-check an invoice on a bucket boundary (e.g., due 60 days
      ago). Confirm correct bucket placement per the documented
      rule.
    expected: |
      Boundary placement correct.
expected_overall: |
  Aging buckets reconcile to invoice ages and grand total equals
  AP control.
pass_criteria: |
  Per-bucket totals match within $0.01 AND grand total = AP control
  within $0.01 AND boundary invoice placed correctly.
why_this_matters: |
  Cash-flow forecasting starts from AP aging. Mis-bucketed invoices
  distort which payments are due when, leading to either late fees
  or unnecessary borrowing.
est_minutes: 12
```
