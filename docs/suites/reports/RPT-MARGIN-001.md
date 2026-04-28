## RPT-MARGIN-001 — Gross margin by product ties to invoice revenue and COGS per part

```yaml
id: RPT-MARGIN-001
title: Gross margin by product reconciles per-part revenue, COGS, and margin to source records
goal: |
  Run the gross margin by product report. Verify per-part revenue
  equals invoice line revenue (RPT-SALESPROD-001), per-part COGS
  equals the cost component of those invoice lines (or the WO
  completion COGS posting), and gross margin = revenue - COGS.
roles:
  - Controller
  - Sales / Account Manager
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-O2C-INVOICE
  - CAP-MFG-COMPLETE
preconditions:
  - At least one part has invoice line activity in the period
    AND a corresponding WO completion / standard cost.
prerequisite_cases:
  - P4-INV-001
  - P4-COMP-FINAL
  - RPT-SALESPROD-001
steps:
  - n: 1
    action: |
      Run gross margin by product for the period.
    expected: |
      Report shows per-part: units sold, revenue, COGS, gross
      margin $, gross margin %.
  - n: 2
    action: |
      For one part, compare revenue to its row on
      RPT-SALESPROD-001.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      For the same part, sum the COGS posted at invoicing (or WO
      completion) for those invoice lines. Compare to the report's
      COGS column.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Verify gross margin $ = revenue - COGS and gross margin % =
      margin $ / revenue × 100 per row.
    expected: |
      Match within $0.01 and 0.1 pp.
  - n: 5
    action: |
      Sum total revenue and total COGS across the report.
      Compare to the P&L's revenue and COGS.
    expected: |
      Match within $0.01.
expected_overall: |
  Per-part revenue, COGS, and margin reconcile to source records
  and roll up to the P&L.
pass_criteria: |
  Per-part revenue and COGS each reconcile within $0.01 AND
  margin computation is correct AND grand totals tie to P&L.
why_this_matters: |
  Product-level margin drives pricing and rationalization. A
  wrong margin steers the company toward unprofitable products
  and away from profitable ones.
est_minutes: 12
```
