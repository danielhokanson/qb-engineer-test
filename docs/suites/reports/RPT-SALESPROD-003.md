## RPT-SALESPROD-003 — Drill-through from sales-by-product to invoice line detail

```yaml
id: RPT-SALESPROD-003
title: Sales-by-product drill-through opens the part's invoice line detail
goal: |
  From the sales-by-product report, drill into one part. Verify the
  drill opens the invoice lines that contributed to the row, with
  qty × price - discount summing to the parent row.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - At least one part has multiple invoice lines in the period
    (sold to multiple customers or on multiple dates).
prerequisite_cases:
  - P4-INV-001
  - RPT-SALESPROD-001
steps:
  - n: 1
    action: |
      Run sales-by-product for the period.
    expected: |
      Renders.
  - n: 2
    action: |
      Drill into one part's row.
    expected: |
      Invoice line list opens for that part across all customers in
      the date range.
  - n: 3
    action: |
      For each line, compute (qty × unit price) - discount. Sum.
      Compare to the part's row revenue.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Click into one line. Confirm the parent invoice opens with the
      same customer and totals.
    expected: |
      Match.
expected_overall: |
  Drill exposes correct lines and reconciles to the parent row.
pass_criteria: |
  Sum of (qty × price - discount) on the drill list matches the
  parent row within $0.01 AND the parent invoice opens correctly.
est_minutes: 8
```
