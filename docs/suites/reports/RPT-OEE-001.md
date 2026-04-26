## RPT-OEE-001 — OEE reflects availability, performance, and quality from floor data

```yaml
id: RPT-OEE-001
title: OEE report reconciles to availability, performance, and quality records
goal: |
  Run the OEE (Overall Equipment Effectiveness) report for a work
  center and verify the three component metrics reconcile to source
  data: availability from stoppage records, performance from cycle
  times, and quality from QC pass / scrap records.
roles:
  - Production Manager
  - QC Inspector
preconditions:
  - At least one work center ran a complete WO with labor, completion,
    and any QC outcomes recorded.
  - Stoppage data has been recorded (P5-STOPPAGE) at least once.
prerequisite_cases:
  - P5-STOPPAGE
steps:
  - n: 1
    action: |
      Run the OEE report for the work center for the period.
    expected: |
      Report shows availability %, performance %, quality %, and
      composite OEE %.
  - n: 2
    action: |
      Availability: (planned production time - stoppage time) /
      planned production time. Compute by pulling calendar planned
      hours and subtracting recorded stoppage minutes.
    expected: |
      Compute. Compare to the report's availability.
  - n: 3
    action: |
      Performance: actual cycle output / theoretical output at routing
      standard.
    expected: |
      Compute. Compare to the report.
  - n: 4
    action: |
      Quality: good units completed / total units completed.
    expected: |
      Compute. Compare to the report.
expected_overall: |
  All three OEE components reconcile to source records.
pass_criteria: |
  Each component matches the report within 0.5 percentage points.
why_this_matters: |
  OEE is the headline manufacturing metric. If it's wrong, plant
  managers either chase ghosts or miss real problems.
est_minutes: 12
```
