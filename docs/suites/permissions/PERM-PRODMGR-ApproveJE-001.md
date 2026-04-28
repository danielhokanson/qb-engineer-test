## PERM-PRODMGR-ApproveJE-001 — Production Manager cannot approve a JE

```yaml
id: PERM-PRODMGR-ApproveJE-001
title: Production Manager is denied approving a journal entry
goal: |
  Verify a Production Manager cannot approve pending JEs.
roles:
  - Production Manager
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one over-threshold JE awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for the JE approval queue.
    expected: |
      The approval queue is not visible.
  - n: 2
    action: |
      Attempt the approve-JE endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Production Manager cannot approve a JE.
pass_criteria: |
  No JE approved by this user AND endpoint rejected.
est_minutes: 3
```
