## RPT-BALSHEET-001 — Balance sheet balances and ties to subledgers

```yaml
id: RPT-BALSHEET-001
title: Balance sheet ties to AR, AP, inventory, and fixed-asset subledgers
goal: |
  Run the balance sheet as of the close date and verify that AR, AP,
  inventory, and fixed-asset totals match their respective subledger
  reports — and that the sheet itself balances.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
  - CAP-RPT-INVVAL
preconditions:
  - The period has been closed (P5-CLOSE-004).
  - AR aging, AP aging, inventory valuation, and a depreciation
    schedule are runnable.
prerequisite_cases:
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Run the balance sheet as of the close date.
    expected: |
      Report renders. Total assets and total liabilities + equity are
      both displayed.
  - n: 2
    action: |
      Verify total assets equal total liabilities + equity.
    expected: |
      Equal to the cent.
  - n: 3
    action: |
      AR control = total of AR aging report. Compare.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      AP control = total of AP aging report. Compare.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Inventory control = total of inventory valuation report. Compare.
    expected: |
      Match within $0.01.
  - n: 6
    action: |
      Net fixed assets = depreciation schedule's net book value total.
      Compare.
    expected: |
      Match within $0.01.
expected_overall: |
  Balance sheet balances and every control account ties to its
  subledger.
pass_criteria: |
  All four subledger ties match within $0.01 AND assets = liabilities
  + equity.
est_minutes: 15
```
