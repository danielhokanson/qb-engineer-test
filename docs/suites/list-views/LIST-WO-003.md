## LIST-WO-003 — WO list: multi-column sort

```yaml
id: LIST-WO-003
title: WO list supports stable multi-column sort
goal: |
  Verify the WO list supports a multi-column sort (e.g., work
  center, then due date, then priority) with stable ordering.
roles:
  - Production Manager
  - Production Planner
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 WOs exist across multiple work centers, due dates,
    and priorities.
steps:
  - n: 1
    action: |
      Sort by work center (ascending) as primary.
    expected: |
      WOs group by work center alphabetically.
  - n: 2
    action: |
      Add secondary sort: due date (ascending).
    expected: |
      Within each work center, WOs are ordered earliest-due first.
  - n: 3
    action: |
      Add tertiary sort: priority (descending, high-first).
    expected: |
      Within each (work center, due date) group, ties break by
      priority high-first.
  - n: 4
    action: |
      Reverse primary direction.
    expected: |
      Group order flips. Secondary and tertiary unchanged.
  - n: 5
    action: |
      Clear all sorts.
    expected: |
      Default ordering restored.
expected_overall: |
  Multi-column sort supports realistic floor-management views.
pass_criteria: |
  Sort precedence is correct, stable, and visually communicated.
est_minutes: 5
```
