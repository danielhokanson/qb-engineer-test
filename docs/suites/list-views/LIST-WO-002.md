## LIST-WO-002 — WO list: pagination over 5,000 rows

```yaml
id: LIST-WO-002
title: WO list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the WO list scales to a year of production history
  (>= 5,000 WOs) without slow loads or pagination errors.
roles:
  - Production Manager
  - Production Planner
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-LIST-UX
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=wo&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 WOs exist across statuses, work centers, and
    due dates.
steps:
  - n: 1
    action: |
      Open the WO list. Note total record count.
    expected: |
      Total reflects full WO history. Initial page renders in under
      2 seconds.
  - n: 2
    action: |
      Page through forward several times, then jump to last page.
    expected: |
      Each page is correct. No duplicate or skipped rows across
      boundaries.
  - n: 3
    action: |
      Filter to status = In-progress and verify pagination on the
      filtered set.
    expected: |
      Pagination recalculates against filtered total.
  - n: 4
    action: |
      Change page size to the largest supported option.
    expected: |
      List re-paginates correctly.
expected_overall: |
  WO list is usable at production-floor scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 5
```
