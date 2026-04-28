## RPT-CASHFLOW-001 — Cash flow statement reconciles to net income and balance-sheet movement

```yaml
id: RPT-CASHFLOW-001
title: Cash flow ties to net income and bank-account movement
goal: |
  Run the cash flow statement (indirect method) and verify it
  reconciles to net income and to the actual change in cash on the
  balance sheet.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
preconditions:
  - The period is closed and a P&L and balance sheet have been run
    for it.
  - Beginning and ending cash balances are visible from the balance
    sheets.
prerequisite_cases:
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Run the cash flow statement for the period.
    expected: |
      Report shows operating, investing, and financing sections plus
      net change in cash.
  - n: 2
    action: |
      Net income reported on the cash flow's first line equals the
      P&L's net income.
    expected: |
      Match.
  - n: 3
    action: |
      Net change in cash equals (ending cash on the balance sheet -
      beginning cash on the prior balance sheet).
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Spot-check one investing line (e.g., the asset purchase from
      P3-ASSET-COMM-001 should appear under investing).
    expected: |
      Asset purchase shows in investing activities for the correct
      amount.
expected_overall: |
  Cash flow ties to net income and to the balance sheet's cash
  movement.
pass_criteria: |
  All three reconciliations match within $0.01 AND a known investing
  transaction is in the right section.
est_minutes: 10
```
