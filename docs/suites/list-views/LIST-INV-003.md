## LIST-INV-003 — Invoice list: pagination over 5,000 rows

```yaml
id: LIST-INV-003
title: Invoice list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the invoice list scales to a year of AR history (>= 5,000
  invoices) without slow loads or pagination errors.
roles:
  - Controller
  - AR / Collections
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=invoice&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 invoices exist across statuses, customers, and
    dates.
steps:
  - n: 1
    action: |
      Open the invoice list. Note total record count.
    expected: |
      Total reflects full AR history. Initial page renders in under
      2 seconds.
  - n: 2
    action: |
      Page through forward, then jump to last.
    expected: |
      Each page is correct. No duplicates / skipped rows.
  - n: 3
    action: |
      Filter to status = Open and verify pagination on the filtered
      set.
    expected: |
      Pagination recalculates against filtered total.
  - n: 4
    action: |
      Change page size to the largest supported option.
    expected: |
      List re-paginates correctly.
expected_overall: |
  Invoice list is usable at multi-year AR scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 5
```
