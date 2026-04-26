## ACCT-RPT-001 — Profit and loss for a period reports correct totals

```yaml
id: ACCT-RPT-001
title: P&L for a chosen date range shows correct income, expenses, and net
goal: |
  Verify that the profit-and-loss report for a chosen date range
  totals income from posted invoices (less voids), totals expenses
  from posted bills and payroll, and reports net profit equal to
  income minus expenses to the cent.
optional_module: builtin-accounting
roles:
  - Shop Owner
preconditions:
  - Activity exists in the period — at least one posted invoice,
    one posted vendor bill, and one pay run.
prerequisite_cases:
  - ACCT-AR-001
  - ACCT-AP-001
  - ACCT-PAY-001
steps:
  - n: 1
    action: |
      Run the P&L for the current period.
    expected: |
      The report shows income, expenses by category, and net profit.
      Each section's subtotal matches the sum of its line items.
  - n: 2
    action: |
      Manually total the period's posted (non-void) invoice amounts
      and compare to the report's income total.
    expected: |
      The two totals match exactly.
  - n: 3
    action: |
      Manually total the period's posted bills and payroll expense
      and compare to the report's expense total.
    expected: |
      The two totals match exactly.
  - n: 4
    action: |
      Compare net profit to (income − expenses).
    expected: |
      Net profit equals income minus expenses to the cent.
expected_overall: |
  The P&L ties out to the underlying invoice, bill, and pay-run
  activity.
pass_criteria: |
  Income matches manual sum AND expenses match manual sum AND net
  profit equals the difference exactly.
est_minutes: 8
```
