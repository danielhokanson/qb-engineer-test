## PERM-HR-IssueCreditMemo-001 — HR cannot issue a credit memo

```yaml
id: PERM-HR-IssueCreditMemo-001
title: HR is denied issuing a customer credit memo
goal: |
  Verify an HR user cannot issue credit memos.
roles:
  - HR
preconditions:
  - An HR user exists with no other roles attached.
  - At least one customer with an open AR balance exists.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for any credit-memo issuance surface.
    expected: |
      The issuance surface is not visible.
  - n: 2
    action: |
      Attempt the issue-credit-memo endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  HR cannot issue a credit memo.
pass_criteria: |
  No credit memo posted AND endpoint rejected.
est_minutes: 3
```
