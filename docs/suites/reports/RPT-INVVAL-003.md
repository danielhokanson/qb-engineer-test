## RPT-INVVAL-003 — Inventory valuation cost-method tie-out (FIFO / weighted-avg)

```yaml
id: RPT-INVVAL-003
title: Inventory valuation reflects the configured cost method per part
goal: |
  For a part costed FIFO (or LIFO, weighted average), verify the
  unit cost on the valuation report equals the cost computed from
  the open-receipt layers (FIFO/LIFO) or the rolling weighted-
  average cost.
roles:
  - Controller
  - Warehouse / Logistics
capabilities:
  - CAP-RPT-INVVAL
  - CAP-INV-CORE
  - CAP-P2P-RECEIVE
preconditions:
  - At least one part is configured for FIFO or weighted-average
    costing AND has at least two receipts at different unit costs
    (P3-RECV-001 run twice with different prices).
prerequisite_cases:
  - P3-RECV-001
  - RPT-INVVAL-001
steps:
  - n: 1
    action: |
      Run the inventory valuation report. Note the unit cost shown
      for the part in question.
    expected: |
      Unit cost is displayed.
  - n: 2
    action: |
      Pull the part's receipt history. For FIFO, the open layers
      are the most recent receipts whose cumulative qty equals
      on-hand; compute extended value = sum(layer qty × layer cost).
    expected: |
      Compute and divide by on-hand to get the implied unit cost.
  - n: 3
    action: |
      For weighted average: weighted avg = sum(receipt qty × receipt
      cost) / sum(receipt qty), adjusted for issues.
    expected: |
      Compute.
  - n: 4
    action: |
      Compare hand-computed unit cost to the report's unit cost.
    expected: |
      Match within $0.0001 per unit (or $0.01 on the extended).
expected_overall: |
  Cost method is being applied correctly: report's unit cost
  matches the hand-computed FIFO / weighted-average cost.
pass_criteria: |
  Hand-computed unit cost matches the report's unit cost within
  $0.0001 per unit AND extended value matches within $0.01.
why_this_matters: |
  A wrong cost method silently mis-states inventory and COGS
  every period. Spot-checking one part per method on every release
  is the cheapest insurance against this class of bug.
est_minutes: 12
```
