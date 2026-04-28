## P4-CASH-LOCKBOX-001 — Apply a lockbox / batch cash file

```yaml
id: P4-CASH-LOCKBOX-001
title: Import a lockbox file and apply payments across multiple invoices
goal: |
  Verify the application can ingest a lockbox-style payment file (or
  batch cash entry) and apply each payment to the right customer /
  invoice combination, including handling unmatched payments.
roles:
  - Controller
flows:
  - quote-to-cash
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-O2C-CASH
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least 5 open customer invoices across multiple customers.
  - A lockbox-format file (or equivalent batch entry) is available.
prerequisite_cases:
  - P4-INV-001
steps:
  - n: 1
    action: |
      Find the lockbox / batch cash area. Upload a file (or batch-
      enter) covering 5 payments — 4 that match invoices, 1 that
      doesn't.
    expected: |
      Preview shows 4 matched and 1 unmatched. Unmatched is held in
      a suspense / unapplied account, not lost.
  - n: 2
    action: |
      Confirm the application.
    expected: |
      4 invoices marked paid. 1 unapplied payment shows as customer
      credit or in a suspense account.
  - n: 3
    action: |
      Manually resolve the unmatched payment (apply to a customer
      manually).
    expected: |
      Payment applies. Suspense clears.
expected_overall: |
  Lockbox processes apply matched payments and surface unmatched
  ones for resolution.
pass_criteria: |
  4 applied AND 1 held in suspense AND manual resolution clears it.
est_minutes: 10
```
