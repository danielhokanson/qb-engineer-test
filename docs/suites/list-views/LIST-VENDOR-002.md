## LIST-VENDOR-002 — Vendor list: pagination over 5,000 rows

```yaml
id: LIST-VENDOR-002
title: Vendor list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the vendor list handles a large dataset (>= 5,000 vendors)
  without slow loads, missing rows, or broken pagination footers.
roles:
  - Procurement
  - Administrator
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-LIST-UX
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=vendor&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 vendors exist (seeded or imported).
steps:
  - n: 1
    action: |
      Open the vendor list and note total record count.
    expected: |
      Total reflects the full vendor count. Initial page renders in
      under 2 seconds.
  - n: 2
    action: |
      Navigate forward several pages, then jump to the last page.
    expected: |
      Each page renders cleanly. No duplicate or skipped rows. Last
      page row count matches the expected remainder.
  - n: 3
    action: |
      Change page size to the largest supported option.
    expected: |
      Pagination footer updates correctly. List remains responsive.
  - n: 4
    action: |
      Apply a partial-name search that should match a few hundred
      vendors and verify pagination across the filtered set.
    expected: |
      Pagination recalculates against the filtered total. No silent
      truncation of the filtered set.
expected_overall: |
  Vendor list is usable at production scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 6
```
