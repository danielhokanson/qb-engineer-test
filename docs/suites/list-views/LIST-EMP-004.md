## LIST-EMP-004 — Employee list: pagination over 5,000 rows

```yaml
id: LIST-EMP-004
title: Employee list paginates cleanly over a 5,000+ row dataset
goal: |
  Verify the employee list scales to a large workforce (>= 5,000
  employees, including terminated history) without slow loads or
  pagination errors.
roles:
  - HR / People Ops
  - Administrator
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-CROSS-LIST-UX
preconditions:
  - Test environment must have >= 5,000 rows of the entity under
    test seeded; use `/api/v1/dev/seed-bulk-list?entity=employee&count=5000`
    (when available) or pre-seed via DB script.
  - At least 5,000 employee records exist (active + terminated
    history).
steps:
  - n: 1
    action: |
      Open the employee list with "include terminated" enabled. Note
      total count.
    expected: |
      Total reflects all employee records. Initial page renders in
      under 2 seconds.
  - n: 2
    action: |
      Page forward several times, then jump to last.
    expected: |
      Each page is correct. No duplicates or skipped rows.
  - n: 3
    action: |
      Filter to status = Active and verify pagination on the
      reduced set.
    expected: |
      Pagination recalculates correctly.
  - n: 4
    action: |
      Change page size to the largest supported option.
    expected: |
      List re-paginates correctly.
expected_overall: |
  Employee list is usable at large-employer scale.
pass_criteria: |
  Pagination correctness and responsiveness hold at 5,000+ rows.
notes: |
  Reconciled in Phase 2 — depends on dev seed-helper endpoint per
  L3 in phase-2-library-reconciliation.md.
est_minutes: 5
```
