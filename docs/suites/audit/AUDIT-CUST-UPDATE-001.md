## AUDIT-CUST-UPDATE-001 — Customer field updates record before / after

```yaml
id: AUDIT-CUST-UPDATE-001
title: Updating a customer's billing address and terms is logged with diff
goal: |
  Verify that updating fields on an existing customer (billing address
  and payment terms) records each changed field with prior and new
  values, actor, and timestamp.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active customer exists.
prerequisite_cases:
  - AUDIT-CUST-CREATE-001
steps:
  - n: 1
    action: |
      Open the customer. Change the billing address. Change payment
      terms to a different option. Save.
    expected: |
      Changes save.
  - n: 2
    action: |
      Open the customer's audit log.
    expected: |
      Update entry shows actor, timestamp, and a diff for each changed
      field with prior and new values. Unchanged fields are not listed.
expected_overall: |
  Customer field updates produce a real diff, not a generic "modified" flag.
pass_criteria: |
  Both changed fields show prior and new values AND unchanged fields
  do not appear in the diff.
est_minutes: 4
```
