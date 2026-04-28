## PERM-SALES-ModifyCreditLimit-001 — Sales cannot change credit limit

```yaml
id: PERM-SALES-ModifyCreditLimit-001
title: Sales / Account Manager is denied changing a customer credit limit
goal: |
  Verify a Sales user can view but cannot change credit limits — that
  authority belongs to Controller / Finance.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists.
  - A customer with an existing credit limit exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Open the customer record. Find the credit
      limit field.
    expected: |
      Field is read-only or not editable for this role.
  - n: 2
    action: |
      Try to PATCH / submit a credit-limit update via direct URL or
      API.
    expected: |
      The update is rejected. Limit is unchanged.
expected_overall: |
  Sales cannot change credit limits.
pass_criteria: |
  Limit unchanged AND endpoint rejected.
est_minutes: 4
```
