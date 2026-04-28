## LIST-SO-004 — Sales order list: pagination over 5,000 rows

```yaml
id: LIST-SO-004
title: SO list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the SO list scales to a year of order history (>= 5,000
  SOs) without slow loads or pagination errors.
roles:
  - Sales / Account Manager
  - Customer Service
capabilities:
  - CAP-O2C-SO
  - CAP-CROSS-LIST-UX
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=so&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 SOs exist across customers, statuses, and dates.
steps:
  - n: 1
    action: |
      Open the SO list. Note total record count.
    expected: |
      Total reflects full SO history. Initial page renders in under
      2 seconds.
  - n: 2
    action: |
      Page forward several times, then jump to last.
    expected: |
      Each page is correct. No duplicates or skipped rows.
  - n: 3
    action: |
      Filter to status = Open and verify pagination on filtered
      set.
    expected: |
      Pagination recalculates correctly.
  - n: 4
    action: |
      Change page size to the largest supported option.
    expected: |
      List re-paginates correctly.
expected_overall: |
  SO list is usable at multi-year order-management scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
  Additionally depends on F1 — SO list endpoint must exist before
  this case can verdict.
est_minutes: 5
```
