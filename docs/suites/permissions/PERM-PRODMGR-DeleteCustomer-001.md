## PERM-PRODMGR-DeleteCustomer-001 — Production Manager cannot delete a customer

```yaml
id: PERM-PRODMGR-DeleteCustomer-001
title: Production Manager is denied deleting a customer record
goal: |
  Verify a Production Manager cannot delete customer records.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one customer record exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Open a customer record if
      visible.
    expected: |
      No delete action is available.
  - n: 2
    action: |
      Attempt the delete endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Production Manager cannot delete a customer record.
pass_criteria: |
  Customer record unchanged AND endpoint rejected.
est_minutes: 3
```
