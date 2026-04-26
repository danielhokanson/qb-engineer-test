## PERM-ADMIN-IssueCreditMemo-001 — Administrator cannot issue a credit memo

```yaml
id: PERM-ADMIN-IssueCreditMemo-001
title: Administrator is denied issuing a customer credit memo
goal: |
  Verify the Administrator cannot issue credit memos.
roles:
  - Administrator
preconditions:
  - The Administrator user exists with no other roles attached.
  - At least one customer with an open AR balance exists.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Look for any credit-memo issuance
      surface.
    expected: |
      The issuance surface is not visible or not enabled.
  - n: 2
    action: |
      Attempt the issue-credit-memo endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Administrator cannot issue a credit memo.
pass_criteria: |
  No credit memo posted AND endpoint rejected.
est_minutes: 3
```
