## PERM-WAREHOUSE-IssueCreditMemo-001 — Warehouse cannot issue a credit memo

```yaml
id: PERM-WAREHOUSE-IssueCreditMemo-001
title: Warehouse / Logistics is denied issuing a customer credit memo
goal: |
  Verify a Warehouse user cannot issue credit memos. They process
  RMAs and return receipts but the financial credit issuance belongs
  to Controller.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-O2C-CREDITMEMO
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Warehouse user exists with no other roles attached.
  - At least one customer with an open AR balance exists.
steps:
  - n: 1
    action: |
      Sign in as Warehouse. Look for any credit-memo issuance
      surface.
    expected: |
      The issuance surface is not visible.
  - n: 2
    action: |
      Attempt the issue-credit-memo endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Warehouse cannot issue a credit memo.
pass_criteria: |
  No credit memo posted AND endpoint rejected.
est_minutes: 3
```
