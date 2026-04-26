## RPT-CAPUTIL-002 — Capacity utilization across a multi-week range rolls up cleanly

```yaml
id: RPT-CAPUTIL-002
title: Multi-week capacity utilization aggregates per-day load to per-week and per-range
goal: |
  Run the capacity utilization report for a 4-week range. Verify
  per-week aggregates equal the sum of their per-day load and that
  the range total equals the sum of weeks.
roles:
  - Production Manager
preconditions:
  - At least one work center has scheduled WO load on multiple
    days across a 4-week span.
prerequisite_cases:
  - P1-CAL-001
  - P4-WO-001
  - RPT-CAPUTIL-001
steps:
  - n: 1
    action: |
      Run capacity utilization for the next 4 weeks, weekly buckets.
    expected: |
      Report shows per-week load and available hours per work center.
  - n: 2
    action: |
      For one work center / one week, sum the daily load. Compare
      to the weekly bucket.
    expected: |
      Match within 0.01 hours.
  - n: 3
    action: |
      For the same work center, sum the four weekly buckets. Compare
      to the report's range total.
    expected: |
      Match within 0.01 hours.
  - n: 4
    action: |
      Verify weeks containing planned-downtime blocks (e.g., a
      holiday) show reduced available hours.
    expected: |
      Available hours dip on the holiday week consistent with the
      calendar.
expected_overall: |
  Multi-week roll-up is correct and calendar overrides flow into the
  available-hours total.
pass_criteria: |
  Daily-to-weekly and weekly-to-range sums match within 0.01 hours
  AND holiday weeks show reduced available hours.
est_minutes: 10
```
