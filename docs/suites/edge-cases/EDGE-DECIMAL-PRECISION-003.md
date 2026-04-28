## EDGE-DECIMAL-PRECISION-003 — Unit-of-measure conversion preserves precision

```yaml
id: EDGE-DECIMAL-PRECISION-003
title: A UoM conversion (e.g., kg ↔ lb) round-trips without precision drift
goal: |
  Verify that converting a quantity from one unit of measure to
  another and back to the original produces the original value within
  the documented precision — and that the intermediate stored value
  retains enough precision to round-trip cleanly.
roles:
  - Engineer / R&D
  - Inventory Clerk
capabilities:
  - CAP-MD-UOM
  - CAP-INV-CORE
  - CAP-MFG-MATL-ISSUE
preconditions:
  - At least one part with a primary UoM and at least one alternate
    UoM (e.g., kilograms with a pounds alternate).
steps:
  - n: 1
    action: |
      Receive 100 kg of a part on a PO. Record the on-hand in kg.
    expected: |
      On-hand shows 100.0000 kg (or whatever precision is documented).
  - n: 2
    action: |
      Convert the on-hand display to pounds. Record the value.
    expected: |
      Conversion shows ~220.4623 lb (using 1 kg = 2.20462262 lb)
      within the documented precision.
  - n: 3
    action: |
      Issue exactly that quantity in pounds back to a work order. Then
      convert the issued amount back to kilograms.
    expected: |
      Round-trip value matches 100 kg within the documented tolerance.
      No silent drift to 99.9998 or 100.0002 kg.
  - n: 4
    action: |
      Confirm the conversion factor itself is stored to enough
      precision to support the round trip.
    expected: |
      Factor is precise to at least the precision required to make the
      round trip exact within tolerance.
expected_overall: |
  UoM conversion is precise enough to round-trip without silent drift.
pass_criteria: |
  Round-trip quantity matches input within tolerance AND tolerance is
  documented.
why_this_matters: |
  Inventory shrinkage that's actually a UoM rounding error is the
  hardest kind of shrinkage to track down. The conversion has to be
  symmetric and precise.
est_minutes: 10
```
