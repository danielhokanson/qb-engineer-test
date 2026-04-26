## LIST-WO-001 — Work order list UX

```yaml
id: LIST-WO-001
title: WO list supports filter by status, work center, due date, and sort
goal: |
  Verify the WO list view filters by status (planned / released /
  in-progress / complete / closed), by work center, by due date
  range, and sorts on every column including computed (% complete,
  variance).
roles:
  - Production Manager
  - Production Planner
preconditions:
  - At least 30 WOs exist across multiple statuses.
prerequisite_cases:
  - P4-WO-001
steps:
  - n: 1
    action: |
      Open the WO list. Filter to "in-progress" + work center =
      Press Shop.
    expected: |
      Result matches both filters.
  - n: 2
    action: |
      Add a date range: due in next 7 days.
    expected: |
      Result narrows.
  - n: 3
    action: |
      Sort by due date (ascending).
    expected: |
      Earliest due first.
  - n: 4
    action: |
      Search by WO number (partial).
    expected: |
      Partial match works.
expected_overall: |
  WO list is usable for daily floor management.
pass_criteria: |
  Filters / sort / search all work correctly.
est_minutes: 6
```
