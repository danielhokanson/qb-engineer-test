## P4-WO-BACKFLUSH-001 — Backflush material consumption on completion

```yaml
id: P4-WO-BACKFLUSH-001
title: A WO configured to backflush consumes BOM materials at completion
goal: |
  Verify that a part / WO marked for backflush automatically consumes
  BOM-defined component quantities from inventory at completion time,
  rather than requiring an explicit issue per operation.
roles:
  - Production Manager
  - Floor Operator
flows:
  - quote-to-cash
capabilities:
  - CAP-MFG-BACKFLUSH
  - CAP-MFG-COMPLETE
  - CAP-INV-LOTS
preconditions:
  - At least one finished part has its BOM configured for backflush.
  - A WO for that part is released and at completion.
prerequisite_cases:
  - P2-BOM-001
  - P4-WO-001
steps:
  - n: 1
    action: |
      Note the inventory of the BOM components before completion.
    expected: |
      Quantities visible.
  - n: 2
    action: |
      Complete the final operation on the WO with good quantity, e.g.,
      100 units.
    expected: |
      Completion accepts. The BOM components are automatically
      consumed at the per-unit quantity × 100 — no explicit issue
      step required.
  - n: 3
    action: |
      Verify component inventory dropped by the expected amount.
    expected: |
      Match.
  - n: 4
    action: |
      For lot-tracked components, verify a lot was consumed (FEFO
      default).
    expected: |
      Lot trace recorded.
expected_overall: |
  Backflush correctly consumes materials at completion.
pass_criteria: |
  Inventory dropped by exact BOM-extended quantity AND lot trace
  recorded for lot-tracked components.
est_minutes: 8
```
