## RPT-BALSHEET-003 — Drill-through from balance sheet line to subledger

```yaml
id: RPT-BALSHEET-003
title: Balance sheet drill-through lands on subledger detail
goal: |
  From the balance sheet, drill into the AR control account, the
  inventory account, and the fixed-asset account. Verify each
  drill-through opens the corresponding subledger detail with a
  matching total.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
  - CAP-RPT-INVVAL
preconditions:
  - Balance sheet runs cleanly (RPT-BALSHEET-001 has passed).
prerequisite_cases:
  - RPT-BALSHEET-001
steps:
  - n: 1
    action: |
      Run the balance sheet as of the close date.
    expected: |
      Report renders.
  - n: 2
    action: |
      Drill into the AR control account. The drill-through should
      land on AR aging detail or an AR transaction list.
    expected: |
      Subledger opens. Total at the bottom equals the AR control
      balance within $0.01.
  - n: 3
    action: |
      Drill into the inventory account. Should land on the inventory
      valuation report.
    expected: |
      Inventory valuation grand total equals the inventory account
      balance within $0.01.
  - n: 4
    action: |
      Drill into net fixed assets. Should land on the depreciation
      schedule or fixed-asset register.
    expected: |
      Net book value total equals the net fixed-asset balance within
      $0.01.
expected_overall: |
  Every subledger drill-through lands on the correct detail and the
  detail total matches the control account.
pass_criteria: |
  All three drill-throughs land on the right subledger AND each
  subledger total ties to its control balance within $0.01.
why_this_matters: |
  Subledger ties are the auditor's first checkpoint. A drill-through
  that opens the wrong screen — or one with stale totals — burns
  audit hours fast.
est_minutes: 10
```
