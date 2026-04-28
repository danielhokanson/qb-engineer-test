## LIST-SO-001 — Sales order list: partial-match search

```yaml
id: LIST-SO-001
title: SO list supports partial-match search across SO number, customer, item
goal: |
  Verify the sales order list search is partial, case-insensitive,
  and matches against SO number, customer name, customer PO number,
  and line-item part number.
roles:
  - Sales / Account Manager
  - Customer Service
capabilities:
  - CAP-O2C-SO
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 100 SOs exist with varied SO numbers, customers, and
    line items.
steps:
  - n: 1
    action: |
      Open the SO list. Search for a partial SO number.
    expected: |
      Partial match returns SOs whose number contains the fragment.
  - n: 2
    action: |
      Search for a partial customer name.
    expected: |
      SOs for customers matching the fragment appear.
  - n: 3
    action: |
      Search for a customer PO number fragment.
    expected: |
      SOs whose customer PO contains the fragment appear.
  - n: 4
    action: |
      Search for a line-item part number that appears on SO lines.
    expected: |
      SOs containing that line item appear.
  - n: 5
    action: |
      Combine search with a status filter (e.g., Open).
    expected: |
      Result is the intersection.
expected_overall: |
  SO search supports the day-to-day "find that order" workflow.
pass_criteria: |
  Partial / case-insensitive / multi-field search works correctly.
est_minutes: 6
```
