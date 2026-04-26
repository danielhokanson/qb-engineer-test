## PERM-PROCUREMENT-ModifyCreditLimit-001 — Procurement cannot modify credit limit

```yaml
id: PERM-PROCUREMENT-ModifyCreditLimit-001
title: Procurement is denied changing a customer credit limit
goal: |
  Verify a Procurement user cannot change customer credit limits.
  Procurement deals with vendor terms, not customer credit.
roles:
  - Procurement
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one customer with an existing credit limit exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Open a customer record if visible.
    expected: |
      Credit limit field is read-only or hidden.
  - n: 2
    action: |
      Try to PATCH a credit-limit update via direct URL or API.
    expected: |
      The update is rejected.
expected_overall: |
  Procurement cannot change credit limits.
pass_criteria: |
  Limit unchanged AND endpoint rejected.
est_minutes: 3
```
