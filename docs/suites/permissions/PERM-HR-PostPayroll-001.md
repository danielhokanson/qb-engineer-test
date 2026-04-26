## PERM-HR-PostPayroll-001 — HR can post a payroll run

```yaml
id: PERM-HR-PostPayroll-001
title: HR is allowed to post a payroll run
goal: |
  Verify an HR user can post a prepared payroll run, generating the
  associated GL entries, and that the action is recorded in the
  audit log with employee count and net pay total.
roles:
  - HR
preconditions:
  - An HR user exists.
  - At least one prepared payroll run is ready to post.
  - The fiscal period containing the pay date is open.
steps:
  - n: 1
    action: |
      Sign in as HR. Open the prepared payroll run.
    expected: |
      The Post action is enabled. The run summary shows employee
      count and net pay total.
  - n: 2
    action: |
      Post the payroll run. Confirm any prompts.
    expected: |
      The run transitions to Posted. Associated GL entries are
      created (gross wages, tax withholdings, employer contributions,
      net pay liability).
  - n: 3
    action: |
      Open the audit log.
    expected: |
      Post action is attributed to the HR user with timestamp,
      employee count, gross / net totals, and the GL document
      reference.
expected_overall: |
  HR posts payroll; action is auditable with totals and GL link.
pass_criteria: |
  Run posted AND GL entries created AND audit log captures user,
  timestamp, totals, and GL reference.
est_minutes: 6
```
