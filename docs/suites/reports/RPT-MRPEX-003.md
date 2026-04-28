## RPT-MRPEX-003 — MRP exception with extended horizon picks up later shortages

```yaml
id: RPT-MRPEX-003
title: MRP exception report with longer planning horizon flags later-period shortages
goal: |
  Run the MRP exception with a 30-day horizon, then again with a
  90-day horizon. Verify a part that is fine in 30 days but short in
  60 days appears only in the 90-day run, with the right required
  date.
roles:
  - Production Planner
capabilities:
  - CAP-RPT-MRPEX
  - CAP-PLAN-MRP
  - CAP-PLAN-FORECAST
preconditions:
  - At least one part has demand 60-90 days out that exceeds
    on-hand + on-order through that date but is fine within 30 days
    (P3-FCST-001 has loaded forward demand).
prerequisite_cases:
  - P3-MRP-001
  - P3-FCST-001
  - RPT-MRPEX-001
steps:
  - n: 1
    action: |
      Run the MRP exception report with horizon = 30 days.
    expected: |
      Report does NOT include the late-shortage part.
  - n: 2
    action: |
      Run the same report with horizon = 90 days.
    expected: |
      Report DOES include the late-shortage part with a required
      date in the 60-90 day window.
  - n: 3
    action: |
      Hand-compute: cumulative demand through 90 days minus on-hand
      minus on-order arriving in that window. Confirm shortage qty
      and required date.
    expected: |
      Match.
expected_overall: |
  Horizon parameter correctly extends the look-ahead and the late-
  period shortage is identified at the right date.
pass_criteria: |
  Late shortage is absent at 30-day horizon AND present at 90-day
  horizon AND required date matches hand-computation.
est_minutes: 10
```
