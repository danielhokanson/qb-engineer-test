## EDGE-DECIMAL-PRECISION-001 — Quantities and unit costs preserve documented decimal precision

```yaml
id: EDGE-DECIMAL-PRECISION-001
title: Transactions preserve documented decimal precision for quantities and costs
goal: |
  Verify that quantities and unit costs are stored at the precision
  the application documents (typically four decimals on quantity, six
  on unit cost) and that aggregations don't round prematurely.
roles:
  - Controller
  - Engineer / R&D
preconditions:
  - At least one part with a non-trivial UoM (e.g., RM-STEEL-1018-3X3
    in feet).
steps:
  - n: 1
    action: |
      On a draft PO, enter a quantity of 100.1234 ft at unit cost
      $4.567890. Save.
    expected: |
      Form accepts the precision. Saved values match exactly.
  - n: 2
    action: |
      Reopen the line. Verify both values are preserved at full
      precision.
    expected: |
      Saved quantity = 100.1234, saved unit cost = 4.567890. No
      truncation.
  - n: 3
    action: |
      Compute the line extension by hand: 100.1234 × 4.567890 =
      $457.351... Compare to the system's line total (rounded per
      the application's documented rule, typically $457.35).
    expected: |
      Match within the documented rounding rule. The rule itself is
      visible somewhere (label, tooltip, or doc), not silent.
  - n: 4
    action: |
      Receive the line at the same quantity and verify the inventory
      valuation extension equals the same line extension.
    expected: |
      Match.
expected_overall: |
  Decimal precision is preserved through entry, save, reload, and
  derived calculations. Rounding is explicit.
pass_criteria: |
  Stored values match input AND derived line equals the hand
  computation within the documented rounding rule.
why_this_matters: |
  Silent precision loss compounds. A part priced at $0.123456 per
  unit loses real money on six-figure orders if the system rounds
  early.
est_minutes: 8
```
