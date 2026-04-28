## PERM-ITADMIN-ModifyCreditLimit-001 — IT Admin cannot modify credit limit

```yaml
id: PERM-ITADMIN-ModifyCreditLimit-001
title: IT Admin is denied changing a customer credit limit
goal: |
  Verify an IT Admin user cannot change credit limits.
roles:
  - IT Admin
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An IT Admin user exists with no other roles attached.
  - At least one customer with an existing credit limit exists.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Open a customer record. Find the credit
      limit field.
    expected: |
      Field is read-only or not editable.
  - n: 2
    action: |
      Try to PATCH a credit-limit update via direct URL or API.
    expected: |
      The update is rejected.
expected_overall: |
  IT Admin cannot change credit limits.
pass_criteria: |
  Limit unchanged AND endpoint rejected.
est_minutes: 4
```
