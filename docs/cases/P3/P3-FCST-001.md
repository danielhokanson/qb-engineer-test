## P3-FCST-001 — Enter and consume a demand forecast

```yaml
id: P3-FCST-001
title: Enter a demand forecast and verify it is consumed by actual demand
goal: |
  Verify forecast quantities are entered per part per period and that
  actual sales orders consume the forecast (rather than double-
  counting against it).
roles:
  - Sales / Account Manager
  - Production Planner
flows:
  - part-to-inventory
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one finished part exists.
steps:
  - n: 1
    action: |
      Find the demand forecast area. Add a forecast: 100 units of
      FG-BRACKET-A1 in next month.
    expected: |
      Forecast saves.
  - n: 2
    action: |
      Create an SO for 30 units of FG-BRACKET-A1 dated next month.
    expected: |
      SO saves.
  - n: 3
    action: |
      Open the demand picture for next month.
    expected: |
      Total demand = max(forecast, forecast - SO + SO) = 100, NOT
      130. The 30 units of actual demand consume part of the forecast,
      not adding to it.
expected_overall: |
  Forecast and orders combine correctly without double-counting.
pass_criteria: |
  Demand for the forecast period is the correct combined value.
why_this_matters: |
  Double-counting forecast and actual orders is a classic ERP bug
  that causes massive over-purchasing.
est_minutes: 8
```
