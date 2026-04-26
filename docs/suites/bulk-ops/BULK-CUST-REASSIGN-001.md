## BULK-CUST-REASSIGN-001 — Mass-reassign customers to a different account manager

```yaml
id: BULK-CUST-REASSIGN-001
title: Reassign a list of customers to a new account manager
goal: |
  Verify an admin or sales lead can mass-reassign a set of customers
  to a different account manager, the change is audit-logged per
  customer, and the originating manager loses ownership cleanly.
roles:
  - Administrator
  - Sales / Account Manager
preconditions:
  - At least 5 customers exist with one account manager assigned.
  - A second sales user exists.
prerequisite_cases:
  - P2-CUST-004
steps:
  - n: 1
    action: |
      Filter customer list to those owned by Manager A. Select 3.
      Choose mass-reassign. Set new owner = Manager B.
    expected: |
      Action stages preview.
  - n: 2
    action: |
      Confirm.
    expected: |
      All 3 reassigned. Each customer's owner = Manager B.
  - n: 3
    action: |
      Sign in as Manager A and as Manager B. Verify their respective
      customer lists.
    expected: |
      A no longer sees the 3 customers. B does.
expected_overall: |
  Reassignment is clean and audited.
pass_criteria: |
  Ownership changed AND visible in both managers' lists correctly AND
  audited.
est_minutes: 6
```
