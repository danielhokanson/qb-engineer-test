## NOTIF-CREDIT-LIMIT-001 — Credit-limit exceeded alert on sales order entry

```yaml
id: NOTIF-CREDIT-LIMIT-001
title: Sales order that pushes a customer over their credit limit alerts sales and credit
goal: |
  Verify that when a sales order (or order edit) pushes a customer's
  total exposure above their configured credit limit, a notification
  fires to the sales rep and credit officer, surfacing the order for
  review or hold.
roles:
  - Sales / Account Manager
  - Credit Officer
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-MD-CUSTOMERS
  - CAP-O2C-SO
preconditions:
  - A customer has a configured credit limit and existing exposure
    (open orders + AR balance) close to the limit.
prerequisite_cases:
  - P4-SO-001
steps:
  - n: 1
    action: |
      Enter (or edit) a sales order whose total brings exposure above
      the credit limit.
    expected: |
      A credit-limit exceeded notification fires to the sales rep and
      credit officer. Order is flagged or placed on credit hold per
      policy.
  - n: 2
    action: |
      Reduce order quantity / amount so exposure falls back under the
      limit.
    expected: |
      Alert clears. Hold lifts per policy.
  - n: 3
    action: |
      Enter a second order that again exceeds the limit.
    expected: |
      A fresh notification fires (no stuck or duplicated alerts from
      the prior cycle).
expected_overall: |
  Credit-limit alert fires precisely when exposure crosses the limit.
pass_criteria: |
  Alert fires on exceedance AND clears on remediation AND repeats
  cleanly on subsequent breaches.
est_minutes: 8
```
