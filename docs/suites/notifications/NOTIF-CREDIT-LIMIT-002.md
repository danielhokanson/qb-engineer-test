## NOTIF-CREDIT-LIMIT-002 — Credit-limit alert on shipment release of held order

```yaml
id: NOTIF-CREDIT-LIMIT-002
title: Releasing a credit-held shipment notifies controller with override audit
goal: |
  Verify that releasing a shipment for a customer currently over their
  credit limit (manual override) fires a notification to the controller
  and records the override in the customer's audit trail.
roles:
  - Credit Officer
  - Controller
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-CROSS-ACTIVITY-LOG
  - CAP-MD-CUSTOMERS
  - CAP-O2C-SHIP
preconditions:
  - A sales order is on credit hold for a customer over their credit
    limit.
prerequisite_cases:
  - P4-SO-001
  - NOTIF-CREDIT-LIMIT-001
steps:
  - n: 1
    action: |
      As an authorized user, override the credit hold and release the
      shipment.
    expected: |
      A notification fires to the controller naming the order, customer,
      override actor, and reason if captured.
  - n: 2
    action: |
      Open the customer audit trail.
    expected: |
      The override is logged with who / when / amount-over-limit /
      reason.
  - n: 3
    action: |
      Attempt the same override as a user without permission.
    expected: |
      Override is blocked; no notification or audit entry is generated
      for the failed attempt beyond a permission-denied log entry.
expected_overall: |
  Credit overrides are visible to finance leadership and fully audited.
pass_criteria: |
  Override notification fires AND audit captures full detail AND
  unauthorized attempts are blocked and logged separately.
est_minutes: 8
```
