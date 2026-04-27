## LIST-PAY-004 — Payment list: pagination over 5,000 rows

```yaml
id: LIST-PAY-004
title: Payment list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the payment list scales to a year of cash activity
  (>= 5,000 payments) without slow loads or pagination errors.
roles:
  - AR / Collections
  - AP / Accounts Payable
  - Controller
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=payment&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 payments exist across methods, statuses, and
    dates.
steps:
  - n: 1
    action: |
      Open the payment list. Note total record count.
    expected: |
      Total reflects full payment history. Initial page renders in
      under 2 seconds.
  - n: 2
    action: |
      Page forward several times, then jump to last.
    expected: |
      Each page is correct. No duplicates or skipped rows.
  - n: 3
    action: |
      Filter to status = Pending and verify pagination on the
      filtered set.
    expected: |
      Pagination recalculates correctly.
  - n: 4
    action: |
      Change page size to the largest supported option.
    expected: |
      List re-paginates correctly.
expected_overall: |
  Payment list is usable at multi-year cash-management scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 5
```
