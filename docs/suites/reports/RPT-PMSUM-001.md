## RPT-PMSUM-001 — Preventive maintenance summary ties to PM work-order completions

```yaml
id: RPT-PMSUM-001
title: Preventive maintenance summary reconciles scheduled, completed, and overdue PMs
goal: |
  Run the preventive maintenance summary for the period. Verify
  scheduled PM count, completed-on-time count, and overdue count
  reflect actual PM work-order history, and PM compliance % =
  (completed on time) / (scheduled in period) × 100.
roles:
  - Production Manager
preconditions:
  - At least one PM was scheduled and completed on time
    (P5-PM-001) and at least one is overdue (or completed late).
prerequisite_cases:
  - P5-PM-001
  - P5-PM-002
steps:
  - n: 1
    action: |
      Run the PM summary for the period.
    expected: |
      Report shows scheduled, completed on-time, completed late,
      overdue, and compliance %.
  - n: 2
    action: |
      Pull PM work orders scheduled to be due in the period.
      Count.
    expected: |
      Compare to scheduled count. Match.
  - n: 3
    action: |
      Of those, count completed on or before due date. Compare to
      on-time count. Match.
    expected: |
      Match.
  - n: 4
    action: |
      Compliance % = on-time / scheduled × 100.
    expected: |
      Match within 0.1 pp.
  - n: 5
    action: |
      Confirm an asset's overdue PM appears in the overdue
      bucket, not in completed.
    expected: |
      Correct bucket.
expected_overall: |
  PM summary reflects scheduled, completion, and overdue status
  accurately.
pass_criteria: |
  Counts match hand-summed PM history AND compliance % matches
  within 0.1 pp AND overdue PMs are in the overdue bucket.
why_this_matters: |
  PM compliance is regulatory in some industries and operational
  in all. A wrong overdue count masks safety and uptime risk.
est_minutes: 10
```
