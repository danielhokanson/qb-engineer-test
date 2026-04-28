## EDGE-DECIMAL-PRECISION-002 — Six-decimal unit cost survives a multi-step bill of materials roll-up

```yaml
id: EDGE-DECIMAL-PRECISION-002
title: A six-decimal unit cost rolled up through a multi-level BOM matches a hand calculation
goal: |
  Verify that a raw material with a unit cost specified to six decimal
  places, used in a sub-assembly that is in turn used in a finished
  good, produces a finished-good cost that matches a hand calculation
  to within the documented rounding rule.
roles:
  - Controller
  - Engineer / R&D
capabilities:
  - CAP-MD-BOM
  - CAP-RPT-INVVAL
preconditions:
  - A multi-level BOM exists — at least raw → sub-assembly → finished
    good.
  - At least one raw material can be priced at six decimals.
steps:
  - n: 1
    action: |
      Set the raw material's unit cost to a value with six significant
      decimals (e.g., $0.123456 / unit). Save.
    expected: |
      Form accepts six decimals; saved value preserved.
  - n: 2
    action: |
      Run a cost roll-up on the finished good.
    expected: |
      Roll-up completes and produces a finished-good cost.
  - n: 3
    action: |
      Compute the expected finished-good cost by hand using the BOM
      quantities and the raw cost at full six-decimal precision.
      Compare to the system value.
    expected: |
      System value matches hand calculation within the documented
      rounding rule. The rounding rule is visible.
  - n: 4
    action: |
      Confirm intermediate sub-assembly costs are stored at the
      documented precision (not pre-rounded to two decimals before the
      next level).
    expected: |
      Intermediate values retain precision through the roll-up.
expected_overall: |
  Cost roll-up preserves precision through every BOM level.
pass_criteria: |
  Finished-good cost matches hand calculation AND intermediate
  sub-assembly costs retain documented precision.
why_this_matters: |
  Premature rounding at sub-assembly level skews finished-good
  margins. On a part costed in pennies and sold in millions, the
  cumulative error is real money.
est_minutes: 10
```
