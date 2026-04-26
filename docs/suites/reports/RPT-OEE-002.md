## RPT-OEE-002 — OEE broken down by shift reflects per-shift availability and output

```yaml
id: RPT-OEE-002
title: OEE per shift reconciles to that shift's stoppage and completion records
goal: |
  Run OEE per shift (e.g., 1st shift vs. 2nd shift) for one work
  center. Verify each shift's availability, performance, and quality
  reconcile to that shift's stoppage and completion records.
roles:
  - Production Manager
preconditions:
  - At least two shifts have run the same work center on the same
    day with distinct stoppage and completion records.
prerequisite_cases:
  - P5-STOPPAGE
  - P5-HR-SHIFT-001
  - RPT-OEE-001
steps:
  - n: 1
    action: |
      Run OEE per shift for the work center.
    expected: |
      Report shows availability %, performance %, quality %, and
      composite OEE % per shift.
  - n: 2
    action: |
      For shift 1: planned production time minus shift-1 stoppage
      time, divided by planned. Compute and compare to shift 1's
      availability.
    expected: |
      Match within 0.5 percentage points.
  - n: 3
    action: |
      Repeat performance and quality for shift 1 from shift-1
      records.
    expected: |
      Match within 0.5 pp.
  - n: 4
    action: |
      Repeat for shift 2.
    expected: |
      Match within 0.5 pp.
  - n: 5
    action: |
      Confirm a stoppage event tagged to shift 1 does NOT count
      against shift 2.
    expected: |
      No cross-shift leakage.
expected_overall: |
  Per-shift OEE reflects only that shift's records.
pass_criteria: |
  All three components per shift match hand computation within
  0.5 pp AND no cross-shift leakage.
est_minutes: 12
```
