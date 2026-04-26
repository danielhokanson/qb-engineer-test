## PERM-ADMIN-ModifyCreditLimit-001 — Administrator cannot modify credit limit

```yaml
id: PERM-ADMIN-ModifyCreditLimit-001
title: Administrator is denied changing a customer credit limit
goal: |
  Verify the Administrator cannot change customer credit limits. That
  authority belongs to Controller / Finance.
roles:
  - Administrator
preconditions:
  - The Administrator user exists with no other roles attached.
  - At least one customer with an existing credit limit exists.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Open a customer record. Find the
      credit limit field.
    expected: |
      Field is read-only or not editable for this role.
  - n: 2
    action: |
      Try to PATCH / submit a credit-limit update via direct URL or
      API.
    expected: |
      The update is rejected.
expected_overall: |
  Administrator cannot change credit limits.
pass_criteria: |
  Limit unchanged AND endpoint rejected.
est_minutes: 4
```
