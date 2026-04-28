## LIST-INV-004 — Invoice list: multi-column sort

```yaml
id: LIST-INV-004
title: Invoice list supports stable multi-column sort
goal: |
  Verify the invoice list supports multi-column sort (e.g., status,
  then due date, then amount) with stable ordering and visible
  precedence.
roles:
  - Controller
  - AR / Collections
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 invoices exist across statuses, due dates, and
    amounts.
steps:
  - n: 1
    action: |
      Sort by status (ascending) as primary.
    expected: |
      Invoices group by status.
  - n: 2
    action: |
      Add secondary sort: due date (ascending).
    expected: |
      Within each status, invoices are ordered earliest-due first.
  - n: 3
    action: |
      Add tertiary sort: amount due (descending).
    expected: |
      Within each (status, due date) group, ties break by amount
      largest-first.
  - n: 4
    action: |
      Reverse primary direction.
    expected: |
      Group order flips. Secondary and tertiary unchanged.
  - n: 5
    action: |
      Clear all sorts.
    expected: |
      Default ordering restored.
expected_overall: |
  Multi-column sort supports collections / AR triage views.
pass_criteria: |
  Sort precedence is correct, stable, and visually communicated.
est_minutes: 5
```
