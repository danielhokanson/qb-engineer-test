## LIST-BOM-001 — BOM list: partial-match search

```yaml
id: LIST-BOM-001
title: BOM list supports partial-match search by parent part / description
goal: |
  Verify the BOM list search is partial, case-insensitive, and
  matches against the parent part number and BOM / part description.
roles:
  - Engineer / R&D
  - Production Planner
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 BOMs exist across multiple parent parts and
    revisions.
steps:
  - n: 1
    action: |
      Open the BOM list. Search for a partial parent part number.
    expected: |
      Partial match returns BOMs whose parent part number contains
      that fragment (case-insensitive).
  - n: 2
    action: |
      Search for a partial description fragment.
    expected: |
      BOMs whose parent description contains the fragment appear.
  - n: 3
    action: |
      Search for a string that does not match any BOM.
    expected: |
      Empty-state message shown. No stale rows.
  - n: 4
    action: |
      Combine search with a status filter (e.g., Active).
    expected: |
      Result is the intersection.
expected_overall: |
  BOM list search supports the engineering "find that BOM" workflow
  without requiring exact identifiers.
pass_criteria: |
  Partial / case-insensitive / multi-field search works correctly.
est_minutes: 5
```
