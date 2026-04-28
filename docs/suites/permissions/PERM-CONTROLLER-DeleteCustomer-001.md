## PERM-CONTROLLER-DeleteCustomer-001 — Controller cannot delete a customer

```yaml
id: PERM-CONTROLLER-DeleteCustomer-001
title: Controller is denied permanently deleting a customer record
goal: |
  Verify a Controller cannot permanently delete customer records.
  Controllers manage credit and AR but the lifecycle action of
  deleting a master record belongs to Administrator.
roles:
  - Controller
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Controller user exists with no other roles attached.
  - At least one customer record with no transactional history exists.
steps:
  - n: 1
    action: |
      Sign in as Controller. Open the customer record. Look for a
      delete action.
    expected: |
      No delete action is available, or it is disabled.
  - n: 2
    action: |
      Attempt the delete endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Controller cannot delete a customer record.
pass_criteria: |
  Customer record unchanged AND endpoint rejected.
est_minutes: 4
```
