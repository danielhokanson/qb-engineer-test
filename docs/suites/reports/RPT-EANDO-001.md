## RPT-EANDO-001 — Excess and obsolete inventory ties slow movers to recent activity

```yaml
id: RPT-EANDO-001
title: Excess and obsolete (E&O) inventory report reconciles flagged parts to last-activity dates
goal: |
  Run the E&O inventory report. Verify each flagged part's last-
  movement date and on-hand value match the inventory and
  transaction history, and aging buckets (e.g., 0-90, 91-180,
  181-365, 365+ days) are populated by last-activity date.
roles:
  - Controller
  - Warehouse / Logistics
preconditions:
  - At least one part has had no issue / consumption activity for
    180+ days (a slow mover) AND at least one part is actively
    moving (should NOT be flagged).
prerequisite_cases:
  - RPT-INVVAL-001
steps:
  - n: 1
    action: |
      Run the E&O inventory report.
    expected: |
      Report shows per-part: on-hand qty, on-hand value, last
      movement date, age in days, aging bucket.
  - n: 2
    action: |
      For one slow-mover, pull the part's transaction history.
      Confirm last issue / consumption matches the report's last-
      movement date.
    expected: |
      Match.
  - n: 3
    action: |
      Verify the part is bucketed by (report date - last movement)
      into the correct aging bucket per the documented rule.
    expected: |
      Correct bucket.
  - n: 4
    action: |
      Sum on-hand value for the 365+ bucket. This is the headline
      "obsolete inventory" exposure.
    expected: |
      Subtotal available.
  - n: 5
    action: |
      Confirm an actively moving part (last issue ≤ 30 days ago)
      is NOT in the report (or only in the youngest bucket).
    expected: |
      Either excluded or in the freshest bucket.
expected_overall: |
  E&O report ties to last-activity dates and aging buckets are
  correct.
pass_criteria: |
  Slow-mover last-movement date matches transaction history AND
  bucket placement matches documented rule AND active part not
  flagged as old.
why_this_matters: |
  E&O drives reserve provisions and write-down decisions. A wrong
  age makes the company either over-reserve (hitting earnings) or
  under-reserve (delaying losses).
est_minutes: 10
```
