## PERM-FLOOR-IssueCreditMemo-001 — Floor Operator cannot issue a credit memo

```yaml
id: PERM-FLOOR-IssueCreditMemo-001
title: Floor Operator is denied issuing a customer credit memo
goal: |
  Verify a Floor Operator cannot issue credit memos.
roles:
  - Floor Operator
capabilities:
  - CAP-O2C-CREDITMEMO
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one customer with an open AR balance exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any credit-memo issuance
      surface.
    expected: |
      The issuance surface is not visible.
  - n: 2
    action: |
      Attempt the issue-credit-memo endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Floor Operator cannot issue a credit memo.
pass_criteria: |
  No credit memo posted AND endpoint rejected.
est_minutes: 3
```
