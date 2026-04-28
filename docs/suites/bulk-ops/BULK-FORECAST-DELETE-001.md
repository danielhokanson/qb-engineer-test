## BULK-FORECAST-DELETE-001 — Mass-delete obsolete forecast rows

```yaml
id: BULK-FORECAST-DELETE-001
title: Bulk-delete demand-forecast rows for prior periods
goal: |
  Verify a planner can mass-delete forecast rows for periods that
  have already closed, that the deletion does not affect actual
  shipments or MRP history, and the operation is audit-logged
  at the operation level.
roles:
  - Planner
  - Demand Planner
capabilities:
  - CAP-PLAN-FORECAST
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 10 forecast rows exist for periods in the past.
  - At least one part has both forecast rows (deleted target) and
    actual shipment history (must remain).
steps:
  - n: 1
    action: |
      Filter forecast rows to "period < current period." Select all.
    expected: |
      Filter returns only past-period forecast rows.
  - n: 2
    action: |
      Choose bulk-delete. Confirm.
    expected: |
      All filtered rows deleted. Summary reports row count.
  - n: 3
    action: |
      Open the part that had both forecast and actual shipments.
      Run an MRP / sales-vs-forecast report.
    expected: |
      Actual shipment history is intact. Forecast-vs-actual variance
      reports for past periods read from the (now empty) forecast
      cleanly without errors.
expected_overall: |
  Forecast purge is scoped to forecast data and never touches actuals.
pass_criteria: |
  Past forecast rows deleted AND actuals untouched AND reports run
  without error.
est_minutes: 7
```
