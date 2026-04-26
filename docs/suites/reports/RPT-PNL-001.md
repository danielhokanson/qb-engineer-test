## RPT-PNL-001 — P&L ties out to revenue, COGS, and expense transactions

```yaml
id: RPT-PNL-001
title: P&L reconciles to source revenue, COGS, and expense postings
goal: |
  Run the income statement (P&L) for the closed period and verify that
  revenue, cost of goods sold, and operating expense totals tie to the
  underlying transactions that produced them.
roles:
  - Controller
preconditions:
  - The period has been closed (P5-CLOSE-004).
  - At least one customer invoice was posted in the period (P4-INV-001).
  - At least one WO was completed in the period (P4-COMP-FINAL).
  - At least one vendor invoice was posted (P3-AP-001).
prerequisite_cases:
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Run the P&L for the closed period.
    expected: |
      Report renders. Revenue, COGS, gross margin, operating expense,
      and net income are visible.
  - n: 2
    action: |
      Total revenue: from the customer-invoice register, sum the
      revenue lines posted in the period. Compare to the P&L's revenue.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Total COGS: from the WO completion postings, sum the cost of
      goods sold posted in the period. Compare to the P&L's COGS.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Total operating expense: from vendor invoices and JEs posted to
      expense accounts in the period, sum. Compare to the P&L total
      expense.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      If the P&L supports drill-through, click into a revenue line to
      verify the underlying invoice opens.
    expected: |
      Drill-through resolves to the source transaction.
expected_overall: |
  P&L totals tie out to source transaction sums and drill-through
  resolves correctly.
pass_criteria: |
  Revenue, COGS, and expense totals each reconcile within $0.01 to
  the source-transaction sum.
why_this_matters: |
  P&Ls that don't tie out are a leadership-credibility bug. Fixing
  the underlying postings is much harder than catching the
  reconciliation gap before publishing.
est_minutes: 12
```
