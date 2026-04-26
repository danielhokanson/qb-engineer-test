## LIST-CUST-001 — Customer list: search, filter, sort, paginate

```yaml
id: LIST-CUST-001
title: Customer list supports search, filter, sort, and pagination
goal: |
  Verify the customer list view: partial-match search by name and ID,
  filter by status / region / credit band, sort on every column,
  and pagination over a non-trivial dataset.
roles:
  - Sales / Account Manager
  - Administrator
preconditions:
  - At least 50 customers exist (for filter / sort / paginate
    coverage). Some active, some inactive.
steps:
  - n: 1
    action: |
      Open the customer list. Type a partial customer name (e.g.,
      "ACM") into search.
    expected: |
      Results filter live to matching customers (case-insensitive,
      partial match).
  - n: 2
    action: |
      Apply a filter: status = Inactive.
    expected: |
      Only inactive customers shown.
  - n: 3
    action: |
      Sort by name (ascending), then by created date (descending).
    expected: |
      Sort applied. Results reflect sort order.
  - n: 4
    action: |
      Paginate to last page.
    expected: |
      Last page returns the expected tail of the sorted set.
  - n: 5
    action: |
      Save the current filter / sort as a named view (if supported).
    expected: |
      Saved view appears in the list. Re-opening it restores filters.
expected_overall: |
  Customer list is fully usable for normal-day workflows.
pass_criteria: |
  Search / filter / sort / paginate / saved view all work correctly.
est_minutes: 8
```
