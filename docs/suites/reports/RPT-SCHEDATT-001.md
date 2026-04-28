## RPT-SCHEDATT-001 — Production schedule attainment ties to scheduled vs. completed WOs

```yaml
id: RPT-SCHEDATT-001
title: Production schedule attainment reconciles to scheduled and completed WO history
goal: |
  Run the schedule attainment report for the period. Verify
  attainment % = (WOs completed on or before scheduled finish) /
  (WOs scheduled to finish in the period), and that on-time and
  late WO counts reflect actual completion timestamps.
roles:
  - Production Manager
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-MFG-WO-RELEASE
  - CAP-MFG-COMPLETE
preconditions:
  - At least one WO was scheduled to finish in the period and
    completed on time, and at least one was completed late (or
    is still open past its scheduled finish).
prerequisite_cases:
  - P4-WO-001
  - P4-COMP-FINAL
steps:
  - n: 1
    action: |
      Run the schedule attainment report for the period.
    expected: |
      Report shows: scheduled WOs, on-time completions, late
      completions, attainment %.
  - n: 2
    action: |
      Pull WOs scheduled to finish in the period. Count.
    expected: |
      Compare to denominator. Match.
  - n: 3
    action: |
      For each, compare actual completion date to scheduled
      finish. Count on-time (completed ≤ scheduled).
    expected: |
      Compare to numerator. Match.
  - n: 4
    action: |
      Verify attainment % = on-time / scheduled × 100.
    expected: |
      Match within 0.1 pp.
  - n: 5
    action: |
      Confirm a WO scheduled outside the period does NOT influence
      the attainment metric.
    expected: |
      Excluded.
expected_overall: |
  Schedule attainment reflects actual on-time vs. late
  completions within the scheduling window.
pass_criteria: |
  Numerator and denominator match hand counts AND attainment %
  matches within 0.1 pp AND outside-window WOs excluded.
why_this_matters: |
  Schedule attainment is a primary plant-floor KPI. A wrong
  number either masks delivery problems or creates phantom ones,
  both eroding ops manager credibility.
est_minutes: 10
```
