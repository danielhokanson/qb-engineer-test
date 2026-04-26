## PERM-WAREHOUSE-DeleteCustomer-001 — Warehouse cannot delete a customer

```yaml
id: PERM-WAREHOUSE-DeleteCustomer-001
title: Warehouse / Logistics is denied deleting a customer record
goal: |
  Verify a Warehouse user cannot delete customer records.
roles:
  - Warehouse / Logistics
preconditions:
  - A Warehouse user exists with no other roles attached.
  - At least one customer record exists.
steps:
  - n: 1
    action: |
      Sign in as Warehouse. Open a customer record if visible from
      a shipment view.
    expected: |
      No delete action is available.
  - n: 2
    action: |
      Attempt the delete endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Warehouse cannot delete a customer record.
pass_criteria: |
  Customer record unchanged AND endpoint rejected.
est_minutes: 3
```
