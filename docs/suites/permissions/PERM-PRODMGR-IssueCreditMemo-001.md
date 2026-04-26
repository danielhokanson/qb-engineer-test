## PERM-PRODMGR-IssueCreditMemo-001 — Production Manager cannot issue a credit memo

```yaml
id: PERM-PRODMGR-IssueCreditMemo-001
title: Production Manager is denied issuing a customer credit memo
goal: |
  Verify a Production Manager cannot issue credit memos.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one customer with an open AR balance exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for any credit-memo
      issuance surface.
    expected: |
      The issuance surface is not visible.
  - n: 2
    action: |
      Attempt the issue-credit-memo endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Production Manager cannot issue a credit memo.
pass_criteria: |
  No credit memo posted AND endpoint rejected.
est_minutes: 3
```
