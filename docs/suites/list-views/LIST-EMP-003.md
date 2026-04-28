## LIST-EMP-003 — Employee list: multi-column sort

```yaml
id: LIST-EMP-003
title: Employee list supports stable multi-column sort
goal: |
  Verify the employee list supports multi-column sort (e.g.,
  department, then last name, then hire date) with stable ordering
  and visible precedence.
roles:
  - HR / People Ops
  - Administrator
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 employees exist across multiple departments and
    hire dates.
steps:
  - n: 1
    action: |
      Sort by department (ascending) as primary.
    expected: |
      Employees group by department alphabetically.
  - n: 2
    action: |
      Add secondary sort: last name (ascending).
    expected: |
      Within each department, employees alphabetized by last name.
  - n: 3
    action: |
      Add tertiary sort: hire date (ascending).
    expected: |
      Ties within (department, last name) break by earliest hire
      date first.
  - n: 4
    action: |
      Reverse primary direction.
    expected: |
      Department group order flips. Secondary and tertiary
      unchanged.
  - n: 5
    action: |
      Clear all sorts.
    expected: |
      Default ordering restored.
expected_overall: |
  Multi-column sort supports realistic HR / admin views.
pass_criteria: |
  Sort precedence is correct, stable, and visually communicated.
est_minutes: 5
```
