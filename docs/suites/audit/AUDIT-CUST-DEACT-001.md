## AUDIT-CUST-DEACT-001 — Customer deactivation is logged with prior state

```yaml
id: AUDIT-CUST-DEACT-001
title: Deactivating a customer records actor, target, and prior status
goal: |
  Verify that deactivating a customer captures actor, timestamp, target,
  the prior active status, and the new inactive status.
roles:
  - Sales / Account Manager
  - Administrator
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active customer with no open transactions exists.
prerequisite_cases:
  - AUDIT-CUST-CREATE-001
steps:
  - n: 1
    action: |
      Deactivate the customer.
    expected: |
      Customer becomes inactive.
  - n: 2
    action: |
      Open the customer's audit log.
    expected: |
      Deactivation entry shows actor, timestamp, prior status (active),
      new status (inactive), and target customer ID.
expected_overall: |
  Customer status transitions are uniformly audited.
pass_criteria: |
  Deactivation entry present with full before/after status and attribution.
est_minutes: 3
```
