## LIST-BOM-004 — BOM list: pagination over 5,000 rows

```yaml
id: LIST-BOM-004
title: BOM list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the BOM list scales to a realistic engineering catalog
  (>= 5,000 BOMs counting all revisions) without slow loads or
  pagination errors.
roles:
  - Engineer / R&D
  - Production Planner
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-LIST-UX
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=bom&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 BOM records exist (across parents and revisions).
steps:
  - n: 1
    action: |
      Open the BOM list. Note total record count.
    expected: |
      Total reflects all BOM records. Initial page renders in under
      2 seconds.
  - n: 2
    action: |
      Page forward several times, then jump to last.
    expected: |
      Each page is correct. No duplicates or skipped rows.
  - n: 3
    action: |
      Toggle "latest revision only" and verify pagination on the
      reduced set.
    expected: |
      Pagination recalculates correctly.
  - n: 4
    action: |
      Change page size to the largest supported option.
    expected: |
      List re-paginates correctly.
expected_overall: |
  BOM list is usable at production catalog scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 5
```
