## PERM-ITADMIN-ApproveJE-001 — IT Admin cannot approve a JE

```yaml
id: PERM-ITADMIN-ApproveJE-001
title: IT Admin is denied approving a journal entry
goal: |
  Verify an IT Admin cannot approve pending JEs.
roles:
  - IT Admin
preconditions:
  - An IT Admin user exists with no other roles attached.
  - At least one over-threshold JE awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Look for the JE approval queue.
    expected: |
      The approval queue is not visible or not enabled.
  - n: 2
    action: |
      Attempt the approve-JE endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  IT Admin cannot approve a JE.
pass_criteria: |
  No JE approved by this user AND endpoint rejected.
est_minutes: 3
```
