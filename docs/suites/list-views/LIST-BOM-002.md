## LIST-BOM-002 — BOM list: filter by status / revision / effectivity

```yaml
id: LIST-BOM-002
title: BOM list filters by status, revision, and effectivity date
goal: |
  Verify the BOM list supports filtering by status (draft / active /
  obsolete), by revision (latest only vs all revisions), and by
  effectivity date (BOMs effective on a given date).
roles:
  - Engineer / R&D
  - Production Planner
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-LIST-UX
preconditions:
  - BOMs exist with multiple revisions per parent and a mix of
    statuses and effectivity windows.
steps:
  - n: 1
    action: |
      Filter to status = Active. Latest revision only.
    expected: |
      Only the latest active revision per parent appears. Older
      revisions hidden.
  - n: 2
    action: |
      Toggle "show all revisions".
    expected: |
      All revisions appear, including superseded ones, clearly
      labeled with their revision number.
  - n: 3
    action: |
      Filter to BOMs effective on a specific past date.
    expected: |
      Result is the BOMs whose effectivity window contained that
      date — including ones now superseded.
  - n: 4
    action: |
      Combine effectivity filter with status = Obsolete.
    expected: |
      Result is the intersection.
  - n: 5
    action: |
      Clear all filters.
    expected: |
      Default view restored.
expected_overall: |
  BOM filtering supports both current-engineering and historical
  "what was effective then" queries.
pass_criteria: |
  Status / revision / effectivity filters return correct sets.
est_minutes: 6
```
