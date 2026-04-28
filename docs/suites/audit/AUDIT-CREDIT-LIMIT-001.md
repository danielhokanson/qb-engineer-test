## AUDIT-CREDIT-LIMIT-001 — Customer credit limit changes record before / after

```yaml
id: AUDIT-CREDIT-LIMIT-001
title: Increasing or decreasing a customer credit limit is logged with diff
goal: |
  Verify that changing a customer's credit limit records actor,
  timestamp, prior limit, new limit, and reason if the system captures
  one.
roles:
  - Controller
  - Sales / Account Manager
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active customer with a current credit limit exists.
prerequisite_cases:
  - AUDIT-CUST-CREATE-001
steps:
  - n: 1
    action: |
      Open the customer. Increase the credit limit. Save.
    expected: |
      Change saves.
  - n: 2
    action: |
      Decrease the credit limit. Save.
    expected: |
      Change saves.
  - n: 3
    action: |
      Open the customer's audit log filtered to credit-related events.
    expected: |
      Two entries present, each with actor, timestamp, prior limit,
      new limit, and any reason text captured.
expected_overall: |
  Credit limit changes are fully audited for management review.
pass_criteria: |
  Both entries present AND each captures prior and new limit AND
  attribution.
why_this_matters: |
  Credit limit increases shift financial risk. Without an audit trail,
  it is impossible to tell who authorized a high-risk extension after
  the fact.
est_minutes: 4
```
