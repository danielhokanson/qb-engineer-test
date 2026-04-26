## RPT-SALESCUST-001 — Sales by customer ties to invoice register

```yaml
id: RPT-SALESCUST-001
title: Sales by customer report reconciles to invoice register
goal: |
  Run the sales-by-customer report for the period and verify each
  customer's total equals the sum of their posted invoices in the
  period.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - At least one customer invoice exists in the period.
prerequisite_cases:
  - P4-INV-001
steps:
  - n: 1
    action: |
      Run the sales-by-customer report for the period.
    expected: |
      Report lists each customer with totals (revenue, possibly count
      and average).
  - n: 2
    action: |
      For one customer, run the invoice register filtered to that
      customer for the same period.
    expected: |
      Sum of invoices equals the customer's row in the report.
  - n: 3
    action: |
      Verify the report's grand total equals the P&L's revenue total
      for the same period (less non-customer revenue items if any).
    expected: |
      Match within $0.01.
expected_overall: |
  Sales-by-customer ties to the invoice register and the P&L.
pass_criteria: |
  Per-customer total matches the invoice register AND grand total
  ties to the P&L revenue.
est_minutes: 8
```
