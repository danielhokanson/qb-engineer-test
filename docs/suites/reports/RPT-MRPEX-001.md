## RPT-MRPEX-001 — MRP exception report flags real shortfalls

```yaml
id: RPT-MRPEX-001
title: MRP exception report identifies real material shortfalls
goal: |
  Run the MRP exception report and verify it flags only the parts
  whose projected supply is short of demand within the planning
  horizon, with no false positives or false negatives.
roles:
  - Production Planner
  - Procurement
preconditions:
  - At least one open SO with demand exists.
  - At least one part has demand that exceeds on-hand + on-order minus
    safety stock.
  - At least one part has supply ≥ demand (should NOT appear in the
    exception report).
prerequisite_cases:
  - P3-MRP-001
steps:
  - n: 1
    action: |
      Run the MRP exception report.
    expected: |
      Report lists parts with projected shortage, including: required
      date, shortage quantity, suggested action (PO, expedite,
      transfer).
  - n: 2
    action: |
      Verify the part you know is short appears in the report with
      the right shortage quantity.
    expected: |
      Match.
  - n: 3
    action: |
      Verify the part you know is fine does NOT appear.
    expected: |
      Not present.
  - n: 4
    action: |
      Pick one entry. Hand-verify: demand per SO + safety stock vs.
      on-hand + on-order. Compute the shortage.
    expected: |
      Hand-computed shortage matches the report.
expected_overall: |
  MRP exception report correctly identifies real shortfalls and skips
  non-shortfalls.
pass_criteria: |
  Known-short part is present AND known-fine part is absent AND
  spot-checked shortage matches hand computation.
why_this_matters: |
  An MRP exception report with false positives gets ignored. One with
  false negatives causes stockouts. Both are common bugs and both
  silently destroy trust in the planning function.
est_minutes: 10
```
