## RPT-PNL-004 — Drill-through from P&L line lands on source transaction

```yaml
id: RPT-PNL-004
title: P&L drill-through lands on the underlying source transaction
goal: |
  Click drill-through on a P&L revenue line and a P&L expense line.
  Verify each opens the exact source transaction (invoice or vendor
  bill / JE) for the same amount.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
preconditions:
  - At least one customer invoice and one vendor invoice (or expense
    JE) are posted in the closed period.
prerequisite_cases:
  - P5-CLOSE-004
  - RPT-PNL-001
steps:
  - n: 1
    action: |
      Run the P&L for the closed period.
    expected: |
      Report renders.
  - n: 2
    action: |
      Click into the revenue line. Drill down progressively (revenue
      → account detail → transaction list → individual invoice).
    expected: |
      Each drill level shows totals that sum to the parent level.
      The deepest level lists individual invoices.
  - n: 3
    action: |
      Open one invoice from the deepest list. Confirm its amount,
      date, and customer match the system invoice record.
    expected: |
      Match.
  - n: 4
    action: |
      Repeat for an operating-expense line. Drill down to the source
      vendor bill or JE.
    expected: |
      Source transaction opens with matching amount.
  - n: 5
    action: |
      Sum all transactions in the deepest drill list. Compare to the
      P&L line total.
    expected: |
      Match within $0.01.
expected_overall: |
  Drill-through paths land on real source transactions and the
  drill-level sums match the parent line.
pass_criteria: |
  Both drill-throughs (revenue and expense) open the correct source
  AND the drill-list sum reconciles to the parent line within $0.01.
why_this_matters: |
  A drill-through that lands on the wrong record — or just summary
  data — destroys auditor trust. Each level must reconcile.
est_minutes: 10
```
