## LIST-SO-002 — Sales order list: filter by customer / status

```yaml
id: LIST-SO-002
title: SO list filters by customer and by status
goal: |
  Verify the sales order list filters by customer (single and
  multi-select) and by status (draft / confirmed / in-production /
  partially shipped / shipped / closed / cancelled).
roles:
  - Sales / Account Manager
  - Customer Service
capabilities:
  - CAP-O2C-SO
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 SOs exist across multiple customers and all
    supported statuses.
steps:
  - n: 1
    action: |
      Filter to a single customer.
    expected: |
      Only that customer's SOs appear.
  - n: 2
    action: |
      Multi-select two or three customers.
    expected: |
      Result is the union of those customers' SOs.
  - n: 3
    action: |
      Filter to status = Open (i.e., not closed / cancelled).
    expected: |
      Only open-state SOs appear.
  - n: 4
    action: |
      Multi-select status: Confirmed + In-production.
    expected: |
      Result is the union.
  - n: 5
    action: |
      Combine customer filter with status filter.
    expected: |
      Result is the intersection.
expected_overall: |
  Customer + status filtering supports daily order-management
  triage.
pass_criteria: |
  Single, multi-select, and combined filters all behave correctly.
est_minutes: 5
```
