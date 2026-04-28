## AUDIT-EMP-CREATE-001 — New employee record creation is logged

```yaml
id: AUDIT-EMP-CREATE-001
title: Creating an employee record captures actor, target, and initial values
goal: |
  Verify that creating a new employee record (master-data only, distinct
  from creating a system user) logs actor, timestamp, target employee
  ID, and the initial field values.
roles:
  - HR Admin
  - Administrator
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A user with permission to create employees exists.
steps:
  - n: 1
    action: |
      Create a new employee with name, hire date, department, and pay
      class. Save.
    expected: |
      Employee saves successfully.
  - n: 2
    action: |
      Open the audit log filtered to employee events.
    expected: |
      Creation entry shows actor, timestamp, target employee ID, and
      the initial field values as the "after" state.
expected_overall: |
  Employee creation is fully attributed.
pass_criteria: |
  Creation entry present AND captures actor, timestamp, target, and
  initial values.
est_minutes: 4
```
