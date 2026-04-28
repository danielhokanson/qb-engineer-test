## BULK-EMP-DEACT-001 — Mass-deactivate terminated employees

```yaml
id: BULK-EMP-DEACT-001
title: Bulk-deactivate employees who have been terminated in HR
goal: |
  Verify HR or admin can mass-deactivate a set of terminated
  employees, that login access is revoked, that any in-flight
  approvals or assignments are flagged for reassignment, and the
  audit trail records each deactivation.
roles:
  - HR
  - Administrator
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-IDEN-USERS
  - CAP-HR-TERMINATION
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 4 employees have a termination date in the past.
  - At least 1 of them is the assigned approver on an open PO or
    requisition.
steps:
  - n: 1
    action: |
      Filter employees to "termination date is in the past AND
      status = Active." Select all. Choose bulk-deactivate.
    expected: |
      Stage preview shows the affected employees, including any
      with open assignments flagged.
  - n: 2
    action: |
      Confirm.
    expected: |
      Employees deactivated. Login revoked for each. Open approval
      assignments are surfaced for reassignment rather than silently
      stranded.
  - n: 3
    action: |
      Attempt to log in as one of the deactivated employees.
    expected: |
      Login is denied.
expected_overall: |
  Bulk employee deactivation cleanly closes access and surfaces
  orphan assignments.
pass_criteria: |
  Logins revoked AND open assignments surfaced AND audit per
  employee.
est_minutes: 7
```
