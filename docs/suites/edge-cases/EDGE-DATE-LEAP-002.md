## EDGE-DATE-LEAP-002 — Day-365 vs day-366 reports both work in a leap year

```yaml
id: EDGE-DATE-LEAP-002
title: Annual reports treat a leap year as 366 days, not 365
goal: |
  Verify that annual aggregations (sales by day, daily averages, YTD
  rollups) treat a leap year as 366 days. A divide-by-365 average
  silently overstates per-day metrics in a leap year.
roles:
  - Controller
  - Sales Manager
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-RPT-FINANCIALS
preconditions:
  - At least one full leap year of historical transactional data
    exists, OR a backdate-seed script can produce one.
steps:
  - n: 1
    action: |
      Run the annual sales report for a leap year. Confirm the report
      treats December 31 as the 366th day, not the 365th.
    expected: |
      Report shows 366 daily rows (or equivalent) for the leap year.
  - n: 2
    action: |
      If the report shows a daily average, divide annual total by 366
      and compare to the displayed average.
    expected: |
      Average matches division by 366 within penny rounding.
  - n: 3
    action: |
      If the report compares year-over-year, confirm the comparison
      handles 365 vs 366 cleanly — either using actual day counts or
      flagging the asymmetry.
    expected: |
      Comparison either normalizes per-day or labels the difference.
      Silent 365 vs 366 mixing is unacceptable.
expected_overall: |
  Leap year is treated as 366 days everywhere it matters.
pass_criteria: |
  Daily count is 366 AND daily averages divide by 366 AND
  year-over-year comparisons handle the 1-day delta explicitly.
why_this_matters: |
  Once every four years, a system that hardcodes 365 silently
  understates leap-year per-day metrics by 0.27%. It's a small error
  that compounds in capacity planning and budgeting models built on
  daily averages.
est_minutes: 8
```
