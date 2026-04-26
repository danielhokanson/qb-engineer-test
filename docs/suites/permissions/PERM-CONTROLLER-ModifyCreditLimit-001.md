## PERM-CONTROLLER-ModifyCreditLimit-001 — Controller can change a customer credit limit

```yaml
id: PERM-CONTROLLER-ModifyCreditLimit-001
title: Controller is allowed to change a customer credit limit
goal: |
  Verify the Controller can update a customer's credit limit and that
  the change records cleanly in the audit log with prior and new
  values.
roles:
  - Controller
preconditions:
  - A Controller user exists.
  - At least one customer with an existing credit limit exists.
steps:
  - n: 1
    action: |
      Sign in as Controller. Open a customer record. Change the
      credit limit from its current value to a different value. Save.
    expected: |
      Change saves.
  - n: 2
    action: |
      Open the customer's audit log.
    expected: |
      The change is recorded with user, timestamp, prior value, and
      new value.
expected_overall: |
  Controller updates credit limit; change is fully auditable.
pass_criteria: |
  Limit changed AND audit shows before / after / actor / timestamp.
est_minutes: 4
```
