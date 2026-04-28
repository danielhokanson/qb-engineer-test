## RPT-CAPUTIL-001 — Capacity utilization ties to scheduled WO load

```yaml
id: RPT-CAPUTIL-001
title: Capacity utilization report reconciles to scheduled WO load and calendar
goal: |
  Run the capacity utilization report by work center and verify the
  load-vs-available numbers reconcile to scheduled WO operation
  hours and the calendar's available hours.
roles:
  - Production Manager
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-PLAN-CAPACITY
  - CAP-MD-WORKCENTERS
preconditions:
  - At least one WO is scheduled (released and dated) at a known
    work center.
  - The work center's calendar is configured (P1-CAL-001 or its
    override per P1-WC-003).
prerequisite_cases:
  - P1-CAL-001
  - P4-WO-001
steps:
  - n: 1
    action: |
      Run the capacity utilization report for the next 7 days, by
      work center.
    expected: |
      Report shows available hours and load hours per work center
      per day.
  - n: 2
    action: |
      For one day, sum the routing-operation hours for every scheduled
      WO at that work center. This is the load.
    expected: |
      Compute by hand or via a query.
  - n: 3
    action: |
      For the same day, the available hours = calendar shift duration
      minus any planned-downtime block (P1-CAL-003).
    expected: |
      Compute.
  - n: 4
    action: |
      Compare to the report.
    expected: |
      Both load and available match within 0.01 hours.
expected_overall: |
  Capacity report reconciles to scheduled load and calendar.
pass_criteria: |
  Load and available hours both match the hand computation.
est_minutes: 10
```
