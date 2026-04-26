## PERM-FLOOR-ModifyCreditLimit-001 — Floor Operator cannot modify credit limit

```yaml
id: PERM-FLOOR-ModifyCreditLimit-001
title: Floor Operator is denied changing a customer credit limit
goal: |
  Verify a Floor Operator cannot change credit limits — and ideally
  cannot even see customer credit data.
roles:
  - Floor Operator
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one customer with an existing credit limit exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any customer / credit area.
    expected: |
      Customer credit data is not reachable from the navigation.
  - n: 2
    action: |
      Try to PATCH a credit-limit update via direct URL or API.
    expected: |
      The update is rejected.
expected_overall: |
  Floor Operator cannot change credit limits.
pass_criteria: |
  Limit unchanged AND endpoint rejected.
est_minutes: 3
```
