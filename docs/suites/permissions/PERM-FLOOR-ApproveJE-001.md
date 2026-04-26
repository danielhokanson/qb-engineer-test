## PERM-FLOOR-ApproveJE-001 — Floor Operator cannot approve a JE

```yaml
id: PERM-FLOOR-ApproveJE-001
title: Floor Operator is denied approving a journal entry
goal: |
  Verify a Floor Operator cannot approve pending JEs.
roles:
  - Floor Operator
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one over-threshold JE awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for the JE approval queue.
    expected: |
      The approval queue is not visible.
  - n: 2
    action: |
      Attempt the approve-JE endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Floor Operator cannot approve a JE.
pass_criteria: |
  No JE approved by this user AND endpoint rejected.
est_minutes: 3
```
