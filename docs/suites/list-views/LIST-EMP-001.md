## LIST-EMP-001 — Employee list: partial-match search

```yaml
id: LIST-EMP-001
title: Employee list supports partial-match search by name / employee ID
goal: |
  Verify the employee list search is partial, case-insensitive, and
  matches against employee name (first / last), employee ID / badge
  number, and email.
roles:
  - HR / People Ops
  - Administrator
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 100 employees exist with varied names and badge / ID
    formats.
steps:
  - n: 1
    action: |
      Open the employee list. Search for a partial last name.
    expected: |
      Partial match returns employees whose last name contains the
      fragment (case-insensitive).
  - n: 2
    action: |
      Search for a partial first name.
    expected: |
      Employees whose first name contains the fragment appear.
  - n: 3
    action: |
      Search for a partial employee ID / badge number.
    expected: |
      Employees with that ID fragment appear.
  - n: 4
    action: |
      Search for a partial email address.
    expected: |
      Employees whose email contains the fragment appear.
  - n: 5
    action: |
      Combine search with a status filter (e.g., Active).
    expected: |
      Result is the intersection.
expected_overall: |
  Employee search supports the day-to-day "find that person"
  workflow.
pass_criteria: |
  Partial / case-insensitive / multi-field search works correctly.
est_minutes: 5
```
