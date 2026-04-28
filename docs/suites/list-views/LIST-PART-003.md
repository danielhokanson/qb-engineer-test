## LIST-PART-003 — Part list: status filter (active / inactive / obsolete)

```yaml
id: LIST-PART-003
title: Part list supports filter by lifecycle status
goal: |
  Verify the parts list filters by lifecycle status (active /
  inactive / obsolete / phase-out / pending) and that the default
  view excludes obsolete unless explicitly included.
roles:
  - Engineer / R&D
  - Procurement
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-LIST-UX
preconditions:
  - Parts exist in each supported lifecycle status, including at
    least a few obsolete and pending.
steps:
  - n: 1
    action: |
      Open the parts list with default view.
    expected: |
      Default view shows active parts. Obsolete parts are excluded
      unless explicitly opted in (industry norm).
  - n: 2
    action: |
      Filter to status = Obsolete only.
    expected: |
      Only obsolete parts appear.
  - n: 3
    action: |
      Multi-select status: Active + Pending.
    expected: |
      Result is the union of the two statuses.
  - n: 4
    action: |
      Combine status filter with a type filter (e.g., FG only).
    expected: |
      Result is the intersection.
  - n: 5
    action: |
      Clear status filter and confirm the list returns to default.
    expected: |
      Default view restored.
expected_overall: |
  Lifecycle status filtering is precise and the default view does
  not surface noise (obsolete) without intent.
pass_criteria: |
  Single-status, multi-status, and combined filters all behave
  correctly.
est_minutes: 5
```
