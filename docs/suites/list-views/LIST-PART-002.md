## LIST-PART-002 — Part list: pagination over 5,000 rows

```yaml
id: LIST-PART-002
title: Part list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the parts list scales to a realistic catalog (>= 5,000
  parts) without slow loads, missing rows, or pagination errors.
roles:
  - Engineer / R&D
  - Procurement
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-LIST-UX
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=part&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 parts exist across types and tracking modes.
steps:
  - n: 1
    action: |
      Open the parts list. Verify total count and page size selector.
    expected: |
      Total reflects the full catalog. Page size options are sane.
  - n: 2
    action: |
      Page through the first three pages, then jump to the last page.
    expected: |
      Each page renders in under 2 seconds. No duplicate or skipped
      rows. Last page is correct.
  - n: 3
    action: |
      Apply a type filter (e.g., type = Raw material) that reduces
      the set substantially. Re-verify pagination.
    expected: |
      Pagination recalculates against the filtered total.
  - n: 4
    action: |
      Clear filter, change page size to the largest option.
    expected: |
      List re-paginates. No silent truncation.
expected_overall: |
  Parts list is usable at production catalog scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows
  with and without filters.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 6
```
