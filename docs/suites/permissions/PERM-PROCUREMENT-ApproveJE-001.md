## PERM-PROCUREMENT-ApproveJE-001 — Procurement cannot approve a JE

```yaml
id: PERM-PROCUREMENT-ApproveJE-001
title: Procurement is denied approving a journal entry
goal: |
  Verify a Procurement user cannot approve pending JEs.
roles:
  - Procurement
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one over-threshold JE awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Look for the JE approval queue.
    expected: |
      The approval queue is not visible.
  - n: 2
    action: |
      Attempt the approve-JE endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Procurement cannot approve a JE.
pass_criteria: |
  No JE approved by this user AND endpoint rejected.
est_minutes: 3
```
