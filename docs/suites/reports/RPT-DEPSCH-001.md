## RPT-DEPSCH-001 — Depreciation schedule ties to fixed-asset register and GL

```yaml
id: RPT-DEPSCH-001
title: Depreciation schedule reconciles to fixed-asset register and GL postings
goal: |
  Run the depreciation schedule report and verify it ties to the
  fixed-asset register and to the period's GL depreciation postings.
roles:
  - Controller
preconditions:
  - At least one fixed asset has been commissioned and depreciation
    has run (P5-CLOSE-003).
prerequisite_cases:
  - P5-CLOSE-003
steps:
  - n: 1
    action: |
      Run the depreciation schedule report.
    expected: |
      Report lists each asset with cost, accumulated depreciation,
      net book value, and current-period depreciation.
  - n: 2
    action: |
      For one asset, hand-compute current-period depreciation per its
      method (e.g., straight-line: cost / useful life × period).
    expected: |
      Compute and compare to the report row.
  - n: 3
    action: |
      Sum current-period depreciation across all assets. Compare to
      the GL's depreciation expense postings for the period.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Sum accumulated depreciation. Compare to the accumulated
      depreciation contra-asset balance on the trial balance.
    expected: |
      Match within $0.01.
expected_overall: |
  Depreciation schedule ties to per-asset method, GL expense, and
  accumulated balance.
pass_criteria: |
  All three reconciliations match within $0.01.
est_minutes: 10
```
