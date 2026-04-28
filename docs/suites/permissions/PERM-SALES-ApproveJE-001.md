## PERM-SALES-ApproveJE-001 — Sales cannot approve a JE

```yaml
id: PERM-SALES-ApproveJE-001
title: Sales / Account Manager is denied approving a journal entry
goal: |
  Verify a Sales user cannot approve pending JEs.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one over-threshold JE awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look for the JE approval queue.
    expected: |
      The approval queue is not visible.
  - n: 2
    action: |
      Attempt the approve-JE endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Sales cannot approve a JE.
pass_criteria: |
  No JE approved by this user AND endpoint rejected.
est_minutes: 3
```
