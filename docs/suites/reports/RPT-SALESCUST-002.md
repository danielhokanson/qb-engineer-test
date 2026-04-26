## RPT-SALESCUST-002 — Sales by customer for an arbitrary date range respects boundaries

```yaml
id: RPT-SALESCUST-002
title: Sales-by-customer for a custom date range ties only to invoices in that range
goal: |
  Run the sales-by-customer report for a date range that doesn't
  align with the fiscal period. Verify the totals respect the start
  and end dates exactly — no leakage at the boundary.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - Customer invoices exist on multiple dates spanning more than
    a fiscal period.
prerequisite_cases:
  - P4-INV-001
  - RPT-SALESCUST-001
steps:
  - n: 1
    action: |
      Run sales-by-customer for a custom range (e.g., a single
      week mid-period).
    expected: |
      Report renders for the requested range only.
  - n: 2
    action: |
      Pull the invoice register filtered to the same dates and one
      customer. Sum invoice totals.
    expected: |
      Match the customer's row in the report within $0.01.
  - n: 3
    action: |
      Pick an invoice dated one day before the start. Confirm it
      is excluded.
    expected: |
      Excluded.
  - n: 4
    action: |
      Pick an invoice dated one day after the end. Confirm it is
      excluded.
    expected: |
      Excluded.
expected_overall: |
  Date filter is exact at both boundaries and per-customer totals
  reconcile to the date-filtered invoice register.
pass_criteria: |
  Per-customer total matches the date-filtered invoice sum within
  $0.01 AND boundary invoices are correctly included/excluded.
est_minutes: 8
```
