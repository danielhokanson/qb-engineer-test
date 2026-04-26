## PERM-HR-DeleteCustomer-001 — HR cannot delete a customer

```yaml
id: PERM-HR-DeleteCustomer-001
title: HR is denied deleting a customer record
goal: |
  Verify an HR user cannot delete customer records.
roles:
  - HR
preconditions:
  - An HR user exists with no other roles attached.
  - At least one customer record exists.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for any customer area in navigation.
    expected: |
      Customer admin is not reachable.
  - n: 2
    action: |
      Attempt the delete endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  HR cannot delete a customer record.
pass_criteria: |
  Customer record unchanged AND endpoint rejected.
est_minutes: 3
```
