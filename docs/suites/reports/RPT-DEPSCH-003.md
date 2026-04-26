## RPT-DEPSCH-003 — Drill-through from depreciation schedule to asset record

```yaml
id: RPT-DEPSCH-003
title: Depreciation schedule drill-through opens the asset record
goal: |
  From the depreciation schedule, drill into one asset row. Verify
  the underlying asset record opens with matching cost, useful life,
  method, and accumulated depreciation.
roles:
  - Controller
preconditions:
  - At least one fixed asset has been commissioned and depreciated
    in at least one period.
prerequisite_cases:
  - P3-ASSET-COMM-001
  - RPT-DEPSCH-001
steps:
  - n: 1
    action: |
      Run the depreciation schedule.
    expected: |
      Renders.
  - n: 2
    action: |
      Drill into one asset row.
    expected: |
      The asset record opens with cost, useful life, method, salvage
      value, and accumulated depreciation visible.
  - n: 3
    action: |
      Compare cost, useful life, method, and accumulated to the
      schedule row.
    expected: |
      All four match.
  - n: 4
    action: |
      From the asset record, view depreciation history. Sum the
      period postings. Compare to the schedule's accumulated.
    expected: |
      Match within $0.01.
expected_overall: |
  Drill exposes the correct asset and historical postings sum to
  accumulated.
pass_criteria: |
  All four key fields match between schedule and asset record AND
  history sum equals accumulated within $0.01.
est_minutes: 6
```
