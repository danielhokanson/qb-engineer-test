## LIST-PO-003 — PO list: pagination over 5,000 rows

```yaml
id: LIST-PO-003
title: PO list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the PO list scales to a year-plus of procurement history
  (>= 5,000 POs) without slow loads or pagination errors.
roles:
  - Procurement
  - Controller
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=po&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 POs exist across statuses, vendors, and dates.
steps:
  - n: 1
    action: |
      Open the PO list. Note total count and page size.
    expected: |
      Total reflects the full PO history. Initial page renders in
      under 2 seconds.
  - n: 2
    action: |
      Navigate forward several pages, then jump to last.
    expected: |
      Each page is correct. No duplicate or skipped POs across
      boundaries.
  - n: 3
    action: |
      Apply a date-range filter narrowing to the last 90 days, then
      paginate the filtered set.
    expected: |
      Pagination recalculates against filtered total.
  - n: 4
    action: |
      Change page size to the largest supported value.
    expected: |
      List re-paginates correctly.
expected_overall: |
  PO list is usable at multi-year procurement scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 5
```
