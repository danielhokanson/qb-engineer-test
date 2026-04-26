## P5-HR-TERM-001 — Employee termination

```yaml
id: P5-HR-TERM-001
title: Terminate an employee with full offboarding workflow
goal: |
  Verify employee termination disables system access, retains
  historical attribution (labor entries, audit log), produces final
  pay and final-day documentation, and prevents new task / time
  assignment.
roles:
  - HR
  - IT Admin
flows:
  - hire-to-first-assignment
preconditions:
  - At least one employee with an active linked user account exists.
prerequisite_cases:
  - P4-HIRE-002
steps:
  - n: 1
    action: |
      Open the employee record. Initiate termination. Capture
      effective date, reason, and any final-pay items.
    expected: |
      Termination form accepts.
  - n: 2
    action: |
      Confirm.
    expected: |
      Effective date applied. The linked user account is deactivated.
      The employee record transitions to "Terminated" but is preserved.
  - n: 3
    action: |
      Try to sign in as the terminated user.
    expected: |
      Sign-in is rejected.
  - n: 4
    action: |
      Try to assign a WO to the terminated employee.
    expected: |
      Assignment is blocked with "employee terminated" message.
  - n: 5
    action: |
      Run the labor distribution report covering the period before
      termination.
    expected: |
      The terminated employee's prior labor history is intact.
expected_overall: |
  Termination disables access, gates new assignment, preserves
  history.
pass_criteria: |
  Sign-in blocked AND assignment blocked AND history preserved AND
  audit recorded.
est_minutes: 8
```
