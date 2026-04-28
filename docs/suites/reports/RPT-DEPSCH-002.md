## RPT-DEPSCH-002 — Depreciation forecast / projection through the asset's useful life

```yaml
id: RPT-DEPSCH-002
title: Depreciation forecast projects future periods consistent with each asset's method
goal: |
  Run the depreciation schedule's forecast / projection mode (next
  12 months or full remaining life). Verify projected per-period
  depreciation per asset matches its method and that cumulative
  forecast equals (cost - salvage) for assets with predictable
  methods (e.g., straight-line).
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-DEPRECIATION
  - CAP-MD-ASSETS
preconditions:
  - At least one straight-line asset has been commissioned and
    has remaining useful life.
prerequisite_cases:
  - P3-ASSET-COMM-001
  - P5-CLOSE-003
  - RPT-DEPSCH-001
steps:
  - n: 1
    action: |
      Run the depreciation forecast for the next 12 months.
    expected: |
      Report shows per-asset projected depreciation by period.
  - n: 2
    action: |
      For one straight-line asset, hand-compute monthly =
      (cost - salvage) / useful-life-months. Compare to each
      forecast row.
    expected: |
      Match within $0.01 per row.
  - n: 3
    action: |
      Sum all projected depreciation across the asset's remaining
      life. Compare to (cost - salvage - already-accumulated).
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      For a declining-balance asset, confirm projected depreciation
      drops period-over-period at the configured rate.
    expected: |
      Pattern matches the method.
expected_overall: |
  Forecast respects each asset's method and cumulative forecast
  equals (cost - salvage - accumulated) per asset.
pass_criteria: |
  Straight-line per-period match within $0.01 AND cumulative
  matches (cost - salvage - accumulated) within $0.01.
why_this_matters: |
  Capex planning and budgeting depend on this forecast. A wrong
  projection drives wrong cash and tax planning.
est_minutes: 12
```
