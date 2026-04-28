## LIST-BOM-003 — BOM list: multi-column sort

```yaml
id: LIST-BOM-003
title: BOM list supports stable multi-column sort
goal: |
  Verify the BOM list supports multi-column sort (e.g., parent
  part, then revision, then effectivity date) with stable ordering.
roles:
  - Engineer / R&D
  - Production Planner
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 BOMs exist with multiple revisions per parent.
steps:
  - n: 1
    action: |
      Sort by parent part number (ascending) as primary.
    expected: |
      BOMs group by parent part.
  - n: 2
    action: |
      Add secondary sort: revision (descending).
    expected: |
      Within each parent, latest revision listed first.
  - n: 3
    action: |
      Add tertiary sort: effectivity start date (descending).
    expected: |
      Ties within (parent, revision) break by effectivity date.
  - n: 4
    action: |
      Reverse primary direction.
    expected: |
      Group order flips. Secondary and tertiary unchanged.
  - n: 5
    action: |
      Clear all sorts.
    expected: |
      Default ordering restored.
expected_overall: |
  Multi-column sort supports realistic engineering review views.
pass_criteria: |
  Sort precedence is correct, stable, and visually communicated.
est_minutes: 5
```
