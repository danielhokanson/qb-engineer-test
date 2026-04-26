## RPT-WOVAR-002 — WO variance filtered by work center reconciles to that work center's WOs

```yaml
id: RPT-WOVAR-002
title: WO variance filtered by work center ties to that work center's WO postings
goal: |
  Run the WO variance report filtered to a single primary work
  center. Verify the totals equal the sum of variance across only
  WOs whose primary operation runs at that work center.
roles:
  - Controller
  - Production Manager
preconditions:
  - WOs exist whose primary operation is at two or more distinct
    work centers (P4-COMP-FINAL run for multiple WOs).
prerequisite_cases:
  - P4-COMP-FINAL
  - RPT-WOVAR-001
steps:
  - n: 1
    action: |
      Run the WO variance report filtered to work center A.
    expected: |
      Report shows only WOs whose primary operation is at work
      center A.
  - n: 2
    action: |
      Pull the closed WOs primarily at work center A. For each,
      compute (actual cost - standard cost). Sum.
    expected: |
      Compute.
  - n: 3
    action: |
      Compare to the report's total variance.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Confirm a WO primarily at a different work center does NOT
      appear in the filtered report.
    expected: |
      Excluded.
  - n: 5
    action: |
      Run the unfiltered report. Sum (filter A total + filter B
      total + ...). Compare.
    expected: |
      Match within $0.01.
expected_overall: |
  Work-center filter correctly partitions WOs and totals reconcile.
pass_criteria: |
  Filtered total matches hand-computed work-center variance within
  $0.01 AND per-work-center sum equals unfiltered total within $0.01.
est_minutes: 10
```
