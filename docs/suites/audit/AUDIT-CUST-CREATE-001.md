## AUDIT-CUST-CREATE-001 — New customer creation is logged

```yaml
id: AUDIT-CUST-CREATE-001
title: Creating a customer records actor, target, and initial values
goal: |
  Verify that when a new customer is created, the audit log captures
  actor, timestamp, target customer ID, and the initial field values
  recorded against the new record.
roles:
  - Sales / Account Manager
  - Administrator
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A user with permission to create customers exists.
steps:
  - n: 1
    action: |
      Create a new customer with name, billing address, payment terms,
      and credit limit. Save.
    expected: |
      Customer saves successfully.
  - n: 2
    action: |
      Open the audit log filtered to customer events for this record.
    expected: |
      A creation entry is present with actor, timestamp, target customer
      ID / name, and the initial field values recorded as the "after"
      state. There is no "before" state since the record did not exist.
expected_overall: |
  Customer creation is fully attributed and the initial state is preserved.
pass_criteria: |
  Creation entry present AND captures actor, timestamp, target, and
  initial values.
est_minutes: 4
```
