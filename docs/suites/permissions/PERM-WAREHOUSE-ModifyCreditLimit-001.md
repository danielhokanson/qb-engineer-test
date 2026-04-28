## PERM-WAREHOUSE-ModifyCreditLimit-001 — Warehouse cannot modify credit limit

```yaml
id: PERM-WAREHOUSE-ModifyCreditLimit-001
title: Warehouse / Logistics is denied changing a customer credit limit
goal: |
  Verify a Warehouse user cannot change customer credit limits.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Warehouse user exists with no other roles attached.
  - At least one customer with an existing credit limit exists.
steps:
  - n: 1
    action: |
      Sign in as Warehouse. Open a customer record if visible from
      a shipment view.
    expected: |
      Credit limit field is read-only or hidden.
  - n: 2
    action: |
      Try to PATCH a credit-limit update via direct URL or API.
    expected: |
      The update is rejected.
expected_overall: |
  Warehouse cannot change credit limits.
pass_criteria: |
  Limit unchanged AND endpoint rejected.
est_minutes: 3
```
