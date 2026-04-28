## RPT-SALESCUST-004 — Drill-through from sales-by-customer to invoice list

```yaml
id: RPT-SALESCUST-004
title: Sales-by-customer drill-through opens the customer's invoice list
goal: |
  From the sales-by-customer report, drill into one customer. Verify
  the drill opens the list of invoices in scope, with totals matching
  the parent row.
roles:
  - Controller
  - Sales / Account Manager
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-O2C-INVOICE
preconditions:
  - At least one customer has multiple invoices in the period.
prerequisite_cases:
  - P4-INV-001
  - RPT-SALESCUST-001
steps:
  - n: 1
    action: |
      Run sales-by-customer for the period.
    expected: |
      Renders.
  - n: 2
    action: |
      Drill into one customer's row.
    expected: |
      An invoice list opens, scoped to that customer and date range.
  - n: 3
    action: |
      Sum the invoice totals in the drill list. Compare to the
      parent row.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Open one invoice from the drill list. Confirm customer,
      amount, and date match the system invoice.
    expected: |
      Match.
expected_overall: |
  Drill list contains the right invoices and totals reconcile.
pass_criteria: |
  Drill list sum matches parent row within $0.01 AND a spot-checked
  invoice opens correctly from the drill.
est_minutes: 6
```
