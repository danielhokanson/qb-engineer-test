# Edge Cases Suite

The category of bugs that surface only at month-end, only on a leap year, only when an FX rate moves a few decimals, only when a list crosses a few thousand rows. None of these are exotic — they happen every quarter in any real shop. This suite covers the canonical date, currency, decimal-precision, and scale edge cases that ERPs routinely get wrong.

## ID convention

`EDGE-{CATEGORY}-{SCENARIO}-NNN` where category is `DATE`, `FX`, `DECIMAL`, `TAX`, or `SCALE`.

## Sequence

Cases are independent. Each can be run against the post-Phase-5 state with the listed scenario state established.

```yaml
suite: edge-cases
title: Date, currency, decimal, tax, and scale edge cases
description: |
  Bugs that surface only at boundaries: fiscal year end, DST, leap
  year, decimal-precision rounding, FX rate movement, tax-rate change
  mid-period, list views over five thousand rows. The bar is that
  the application handles each cleanly without silent corruption.
estimated_total_minutes: 80

cases:
  - id: EDGE-DATE-FYBOUNDARY-001
  - id: EDGE-DATE-DST-001
  - id: EDGE-DATE-LEAP-001
  - id: EDGE-DATE-TZBOUNDARY-001
  - id: EDGE-FX-ROUNDING-001
  - id: EDGE-FX-RATEMOVE-001
  - id: EDGE-DECIMAL-PRECISION-001
  - id: EDGE-TAX-RATECHANGE-001
  - id: EDGE-SCALE-LARGELIST-001
  - id: EDGE-SCALE-LARGEEXPORT-001

completion_criteria:
  - Every case in the suite has a recorded pass/fail.
  - No silent data corruption occurred in any case.
```
