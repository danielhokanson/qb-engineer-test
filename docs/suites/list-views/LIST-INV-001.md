## LIST-INV-001 — Customer invoice list UX

```yaml
id: LIST-INV-001
title: Invoice list supports filter by customer, status, aging, and sort
goal: |
  Verify the customer invoice list supports filter by customer,
  status (draft / sent / paid / partial / void), aging bucket, and
  sort on every column.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - At least 20 customer invoices exist across statuses and aging
    buckets.
prerequisite_cases:
  - P4-INV-001
steps:
  - n: 1
    action: |
      Open the invoice list. Filter to status = Open + aging > 30
      days.
    expected: |
      Result matches.
  - n: 2
    action: |
      Sort by amount due (descending).
    expected: |
      Sort applied.
  - n: 3
    action: |
      Search by customer PO number.
    expected: |
      Match works.
expected_overall: |
  Invoice list is usable for AR / collections workflows.
pass_criteria: |
  Filters / sort / search all work correctly.
est_minutes: 5
```
