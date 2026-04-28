## RPT-SALESPROD-001 — Sales by product ties to invoice line detail

```yaml
id: RPT-SALESPROD-001
title: Sales by product report reconciles to invoice lines
goal: |
  Run the sales-by-product report for the period and verify each
  part's revenue equals the sum of that part's invoice lines.
roles:
  - Controller
  - Sales / Account Manager
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-O2C-INVOICE
preconditions:
  - At least one customer invoice with one or more part lines exists
    in the period.
prerequisite_cases:
  - P4-INV-001
steps:
  - n: 1
    action: |
      Run the sales-by-product report for the period.
    expected: |
      Report lists each part with units sold, revenue, possibly margin.
  - n: 2
    action: |
      For one part, query the invoice lines: sum the (qty × unit price
      - discount) for that part across all invoices in the period.
    expected: |
      Sum equals the report row's revenue.
  - n: 3
    action: |
      Grand total of revenue across all products equals the
      sales-by-customer report's grand total (and the P&L revenue).
    expected: |
      Match within $0.01.
expected_overall: |
  Sales-by-product ties to invoice line detail and to other revenue
  reports.
pass_criteria: |
  Per-part revenue matches invoice line sum AND grand total
  reconciles to the P&L.
est_minutes: 8
```
