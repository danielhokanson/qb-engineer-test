## RPT-INVVAL-001 — Inventory valuation reconciles to GL inventory account

```yaml
id: RPT-INVVAL-001
title: Inventory valuation report ties to the GL inventory account
goal: |
  Run the inventory valuation report and verify it equals the GL
  inventory control account balance to the cent. This is the report
  P5-CLOSE-001 leans on.
roles:
  - Controller
  - Warehouse / Logistics
preconditions:
  - Inventory exists for at least one part.
  - At least one period has been through the close cycle.
steps:
  - n: 1
    action: |
      Run the inventory valuation report (system on-hand × cost) as
      of the close date.
    expected: |
      Report displays per-part on-hand × unit cost = extended value,
      with a grand total.
  - n: 2
    action: |
      Run the GL trial balance and read the inventory account net
      balance as of the same date.
    expected: |
      The balance is visible.
  - n: 3
    action: |
      Compare grand total to GL inventory balance.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Spot-check one lot-tracked part: sum the open lots' values from
      the lot detail. Compare to the part's row total in the report.
    expected: |
      Match within $0.01.
expected_overall: |
  Inventory valuation ties to GL and lot detail rolls up correctly.
pass_criteria: |
  Grand total = GL inventory balance within $0.01 AND the spot-checked
  lot rollup matches.
est_minutes: 10
```
