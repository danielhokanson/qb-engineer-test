## EDGE-DECIMAL-PRECISION-004 — Sum of high-precision line extensions matches header within rounding rule

```yaml
id: EDGE-DECIMAL-PRECISION-004
title: A sales order with many high-precision lines totals correctly without per-line rounding drift
goal: |
  Verify that a sales order with twenty lines, each with a non-trivial
  fractional unit price (four to six decimals), produces a header
  total that equals the unrounded sum of unrounded line extensions
  rounded once at the end — not the sum of pre-rounded line totals.
roles:
  - Order Entry
  - Controller
capabilities:
  - CAP-O2C-SO
preconditions:
  - At least one customer.
  - At least one part with configurable unit price to six decimals.
steps:
  - n: 1
    action: |
      Create a sales order with 20 lines. On each line, set quantity
      and a unit price with six-decimal precision such that each line
      extension would round differently from its underlying value
      (e.g., 7 units at $0.142857 → $0.999999, rounds to $1.00).
    expected: |
      Each line accepts the unit price.
  - n: 2
    action: |
      Read the displayed line totals and the header total.
    expected: |
      Header total equals (sum of unrounded line extensions) rounded
      once. It does NOT necessarily equal the sum of the rounded line
      totals — the documented rule should be visible.
  - n: 3
    action: |
      Compute by hand: the unrounded sum and the sum-of-rounded values.
      Compare both to the displayed header.
    expected: |
      Header matches one of these per the application's documented
      rule, and the rule is explicit.
expected_overall: |
  Header total reflects a documented rounding strategy and matches
  hand calculation under that strategy.
pass_criteria: |
  Header equals expected total under the documented rule AND the rule
  is visible (label, tooltip, doc).
why_this_matters: |
  "Why is the header off by three cents from the line totals?" is one
  of the most common controller complaints. The rounding rule has to
  be defined, documented, and consistent — not silent.
est_minutes: 10
```
