## PERM-PRODMGR-ModifyCreditLimit-001 — Production Manager cannot modify credit limit

```yaml
id: PERM-PRODMGR-ModifyCreditLimit-001
title: Production Manager is denied changing a customer credit limit
goal: |
  Verify a Production Manager cannot change customer credit limits.
roles:
  - Production Manager
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one customer with an existing credit limit exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Open a customer record if
      visible.
    expected: |
      Credit limit field is read-only or hidden.
  - n: 2
    action: |
      Try to PATCH a credit-limit update via direct URL or API.
    expected: |
      The update is rejected.
expected_overall: |
  Production Manager cannot change credit limits.
pass_criteria: |
  Limit unchanged AND endpoint rejected.
est_minutes: 3
```
