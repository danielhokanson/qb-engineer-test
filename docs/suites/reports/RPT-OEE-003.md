## RPT-OEE-003 — OEE for an arbitrary date range and trend continuity

```yaml
id: RPT-OEE-003
title: OEE across a multi-day range respects the date filter and rolls up
goal: |
  Run OEE for a 7-day range (or longer) and verify the daily OEE
  values compose correctly into the range OEE — and that
  out-of-range stoppages don't leak in.
roles:
  - Production Manager
capabilities:
  - CAP-RPT-OEE
  - CAP-MFG-STOPPAGE
  - CAP-MFG-COMPLETE
preconditions:
  - Stoppage and completion records span 7+ days at one work center.
prerequisite_cases:
  - P5-STOPPAGE
  - RPT-OEE-001
steps:
  - n: 1
    action: |
      Run OEE for the 7-day range with a daily breakdown.
    expected: |
      Report shows per-day OEE plus a range total.
  - n: 2
    action: |
      For one day, hand-compute OEE from that day's stoppage and
      completion. Compare to the daily row.
    expected: |
      Match within 0.5 pp.
  - n: 3
    action: |
      Range OEE: aggregate availability across the 7 days = (sum
      planned time - sum stoppage) / sum planned time. Performance
      and quality similarly aggregated. Compute composite.
    expected: |
      Match the report's range OEE within 0.5 pp.
  - n: 4
    action: |
      Confirm a stoppage from 1 day before the range start does
      NOT influence the range OEE.
    expected: |
      Excluded.
expected_overall: |
  OEE respects the date range and per-day numbers aggregate
  correctly.
pass_criteria: |
  Per-day OEE matches hand computation within 0.5 pp AND range
  OEE matches aggregated computation within 0.5 pp AND boundary
  stoppages excluded.
est_minutes: 10
```
