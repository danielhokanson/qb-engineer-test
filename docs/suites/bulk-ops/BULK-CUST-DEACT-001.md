## BULK-CUST-DEACT-001 — Mass-deactivate inactive customers

```yaml
id: BULK-CUST-DEACT-001
title: Bulk-deactivate customers with no activity in N years
goal: |
  Verify a controller can deactivate a batch of inactive customers
  in one action, that customers with open balances or orders are
  excluded automatically, and that the operation reports per-customer
  outcome.
roles:
  - Controller
  - Administrator
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 5 customers exist; at least 2 have no activity in the
    last 3 years; at least 1 has an open invoice.
steps:
  - n: 1
    action: |
      Find a "customers with no activity in 3 years" filter or
      search. Include the customer with an open invoice deliberately.
    expected: |
      Filter returns the relevant set.
  - n: 2
    action: |
      Choose bulk-deactivate. Confirm.
    expected: |
      Result summary: customers with no balance deactivated. Customer
      with open invoice rejected with reason "Open AR balance —
      cannot deactivate."
  - n: 3
    action: |
      Try to create an SO for one of the deactivated customers.
    expected: |
      Selection blocked or disabled.
expected_overall: |
  Bulk deactivate respects business-rule guardrails.
pass_criteria: |
  Eligible customers deactivated AND ineligible flagged AND no silent
  partial outcome.
est_minutes: 6
```
