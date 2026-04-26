## RPT-CASHFLOW-003 — Drill-through from cash flow line to source transaction

```yaml
id: RPT-CASHFLOW-003
title: Cash flow drill-through opens the underlying cash transaction
goal: |
  From the cash flow statement, drill into one investing line (e.g.,
  a fixed-asset purchase) and one financing line (e.g., a loan
  proceed or repayment). Verify the underlying source transaction
  opens with a matching amount.
roles:
  - Controller
preconditions:
  - At least one fixed-asset purchase exists in the period
    (P3-ASSET-COMM-001).
  - At least one loan, owner contribution, or other financing
    transaction exists.
prerequisite_cases:
  - P5-CLOSE-004
  - P3-ASSET-COMM-001
steps:
  - n: 1
    action: |
      Run the cash flow statement.
    expected: |
      Report renders with operating, investing, and financing
      sections.
  - n: 2
    action: |
      Drill into the investing-section line for the asset purchase.
    expected: |
      Source transaction (the asset commissioning / capex bill)
      opens.
  - n: 3
    action: |
      Compare its amount to the cash flow line.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Drill into one financing line. Confirm the source loan / equity
      transaction opens.
    expected: |
      Source opens with a matching amount.
expected_overall: |
  Both drill-throughs land on real source transactions with matching
  amounts.
pass_criteria: |
  Both drill-throughs open the correct source AND amounts match
  within $0.01.
notes: |
  If the application has no financing activity in the period, sub
  in a second investing line.
est_minutes: 8
```
