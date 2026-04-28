## LIST-EMP-002 — Employee list: filter by department / status / type

```yaml
id: LIST-EMP-002
title: Employee list filters by department, employment status, and type
goal: |
  Verify the employee list filters by department, employment status
  (active / on-leave / terminated), and employment type (full-time /
  part-time / contractor), with combinations supported.
roles:
  - HR / People Ops
  - Administrator
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-CROSS-LIST-UX
preconditions:
  - Employees exist across at least three departments, all
    employment statuses, and at least two employment types.
steps:
  - n: 1
    action: |
      Open the employee list with default view.
    expected: |
      Default view shows active employees. Terminated excluded
      unless explicitly opted in.
  - n: 2
    action: |
      Filter to department = Manufacturing.
    expected: |
      Only Manufacturing employees appear.
  - n: 3
    action: |
      Multi-select department: Manufacturing + Engineering.
    expected: |
      Result is the union.
  - n: 4
    action: |
      Combine department filter with employment type = Contractor.
    expected: |
      Result is the intersection — contractors in those departments.
  - n: 5
    action: |
      Switch status filter to include Terminated and confirm the
      list expands.
    expected: |
      Terminated employees now visible. Default view choice does
      not silently leak across saved-view boundaries.
expected_overall: |
  Department / status / type filtering supports HR and
  administration workflows.
pass_criteria: |
  Each filter and combination returns the correct subset. Default
  view excludes terminated unless opted in.
est_minutes: 5
```
