## LIST-CUST-002 — Customer list: pagination over 5,000 rows

```yaml
id: LIST-CUST-002
title: Customer list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the customer list remains responsive and accurate when the
  dataset exceeds 5,000 rows. Page size, total count, page jump, and
  last-page behavior all work without silent truncation.
roles:
  - Sales / Account Manager
  - Administrator
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-LIST-UX
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=customer&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 customers exist in the dataset (use bulk import or
    seeded data if needed).
steps:
  - n: 1
    action: |
      Open the customer list. Note the displayed total record count
      and the page size selector value.
    expected: |
      Total count reflects the full dataset (>= 5,000). Page size
      selector exposes a sane range (e.g., 25 / 50 / 100).
  - n: 2
    action: |
      Page through the first three pages using next-page control.
    expected: |
      Each page loads in under 2 seconds. No duplicate or missing
      rows across page boundaries.
  - n: 3
    action: |
      Jump directly to the last page (or enter the last page number).
    expected: |
      Last page renders the final partial set. Row count on last page
      equals total mod page size (or full page if evenly divisible).
  - n: 4
    action: |
      Change page size to the largest available option and reload.
    expected: |
      List re-paginates correctly. Total page count updates.
  - n: 5
    action: |
      Apply a filter that should reduce the set to under one page,
      then clear the filter.
    expected: |
      Pagination collapses to one page under the filter, then
      restores to the full pagination footprint when cleared.
expected_overall: |
  Customer list is usable at production scale with no silent
  truncation.
pass_criteria: |
  Total count, page navigation, page size changes, and filter
  interaction with pagination all behave correctly.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 7
```
