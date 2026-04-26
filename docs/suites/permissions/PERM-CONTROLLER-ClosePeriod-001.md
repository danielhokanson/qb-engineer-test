## PERM-CONTROLLER-ClosePeriod-001 — Controller can close a fiscal period

```yaml
id: PERM-CONTROLLER-ClosePeriod-001
title: Controller is allowed to close a fiscal period
goal: |
  Verify a Controller can lock a fiscal period and that the close
  records who and when in the audit log.
roles:
  - Controller
preconditions:
  - A Controller user exists and can sign in.
  - At least one fiscal period is in a state ready to close (no
    unposted required adjustments).
steps:
  - n: 1
    action: |
      Sign in as the Controller. Find the period close action.
    expected: |
      The action is visible and enabled.
  - n: 2
    action: |
      Close the period. Confirm any prompts.
    expected: |
      Period transitions to closed / locked.
  - n: 3
    action: |
      Open the audit log.
    expected: |
      The close action is recorded with Controller user, timestamp,
      and the period closed.
expected_overall: |
  Controller closes a period; the action is auditable.
pass_criteria: |
  Period is closed AND audit log captures user / timestamp.
est_minutes: 5
```
