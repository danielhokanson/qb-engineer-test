## PERM-ADMIN-ApproveJE-001 — Administrator cannot approve a JE

```yaml
id: PERM-ADMIN-ApproveJE-001
title: Administrator is denied approving a journal entry
goal: |
  Verify the Administrator cannot approve pending JEs. Approval is a
  financial control belonging to Controller / Finance.
roles:
  - Administrator
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - The Administrator user exists with no other roles attached.
  - At least one over-threshold JE awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Look for the JE approval queue.
    expected: |
      The approval queue is not visible or not enabled.
  - n: 2
    action: |
      Attempt the approve-JE endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Administrator cannot approve a JE.
pass_criteria: |
  No JE approved by this user AND endpoint rejected.
est_minutes: 4
```
