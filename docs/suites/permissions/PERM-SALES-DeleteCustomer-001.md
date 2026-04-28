## PERM-SALES-DeleteCustomer-001 — Sales cannot delete a customer

```yaml
id: PERM-SALES-DeleteCustomer-001
title: Sales / Account Manager is denied permanently deleting a customer record
goal: |
  Verify a Sales user cannot delete customer records, even ones they
  themselves created. Soft-deactivate is fine; permanent delete must
  require higher authority.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one customer record exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Open the customer record. Look for a delete
      action.
    expected: |
      No delete action is available. A deactivate action may be
      offered separately.
  - n: 2
    action: |
      Attempt the delete endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Sales cannot delete a customer record.
pass_criteria: |
  Customer record unchanged AND endpoint rejected.
why_this_matters: |
  Sales users own the customer relationship and a frustrated user
  may want to "clean up" stale records. Permanent deletion must be
  gated above Sales to preserve the audit trail and prevent loss of
  history.
est_minutes: 4
```
