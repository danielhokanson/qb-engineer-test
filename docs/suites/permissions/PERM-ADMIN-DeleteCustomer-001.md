## PERM-ADMIN-DeleteCustomer-001 — Administrator can delete an unreferenced customer

```yaml
id: PERM-ADMIN-DeleteCustomer-001
title: Administrator is allowed to delete an unreferenced customer record
goal: |
  Verify the Administrator can permanently delete a customer record
  that has no transactional history (no quotes, sales orders,
  invoices, payments, or shipments), and that the deletion is
  recorded in the audit log.
roles:
  - Administrator
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - The Administrator user exists.
  - At least one customer record exists with no transactional
    references (e.g., a misspelled draft customer never used).
steps:
  - n: 1
    action: |
      Sign in as Administrator. Open the customer record. Find the
      delete action.
    expected: |
      The delete action is enabled because the customer has no
      transactional references.
  - n: 2
    action: |
      Delete the customer. Confirm any irreversibility prompt.
    expected: |
      The customer is removed from the active customer list.
  - n: 3
    action: |
      Open the audit log.
    expected: |
      Deletion is attributed to the Administrator with timestamp,
      customer name / id, and a snapshot of the deleted record.
expected_overall: |
  Administrator deletes an unreferenced customer; deletion auditable.
pass_criteria: |
  Customer removed AND audit log captures actor, timestamp, customer
  identity, and a record snapshot.
notes: |
  A customer with any transactional history must NOT be deletable —
  that's a separate negative-state case. This case asserts the
  happy path on truly unreferenced records.
est_minutes: 5
```
