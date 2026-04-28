## LIST-SO-003 — Sales order list: date-range filter

```yaml
id: LIST-SO-003
title: SO list supports date-range filter (order date / promised ship date)
goal: |
  Verify the SO list supports date-range filtering on order date
  and promised ship date, with combinations of status and customer
  filters.
roles:
  - Sales / Account Manager
  - Production Planner
capabilities:
  - CAP-O2C-SO
  - CAP-CROSS-LIST-UX
preconditions:
  - SOs exist with order dates and promised ship dates spanning at
    least the last 12 months.
steps:
  - n: 1
    action: |
      Apply a date-range filter on order date for the last 30 days.
    expected: |
      Only SOs ordered in that window appear.
  - n: 2
    action: |
      Switch the filter to promised ship date and apply a 14-day
      window starting today.
    expected: |
      Result reflects upcoming promised shipments in that window.
  - n: 3
    action: |
      Combine ship-date filter with status = Open.
    expected: |
      Result is the open SOs promised to ship in that window — a
      typical planner triage view.
  - n: 4
    action: |
      Apply an open-ended start-only range.
    expected: |
      All SOs on or after start appear.
  - n: 5
    action: |
      Enter an inverted range and confirm clear handling.
    expected: |
      System rejects with validation, or normalizes. Silent empty
      result is not acceptable.
expected_overall: |
  Date-range filtering supports order management and planning
  triage.
pass_criteria: |
  Each scenario returns the correct SO subset.
est_minutes: 5
```
