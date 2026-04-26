## LIST-PART-001 — Part list UX

```yaml
id: LIST-PART-001
title: Part list supports search, filter (type, lot/serial, status), sort, paginate
goal: |
  Verify the part list view supports search by part number /
  description, filter by type (raw / WIP / FG / service), filter by
  tracking (lot / serial / none), sort on every column, paginate.
roles:
  - Engineer / R&D
  - Procurement
preconditions:
  - At least 50 parts exist across multiple types and tracking modes.
prerequisite_cases:
  - P2-PART-005
steps:
  - n: 1
    action: |
      Open the parts list. Search for partial part number.
    expected: |
      Partial match works on both part number and description.
  - n: 2
    action: |
      Filter to type = Raw material AND tracking = Lot.
    expected: |
      Result is the intersection.
  - n: 3
    action: |
      Sort by description (ascending), then by primary UoM.
    expected: |
      Sort applied.
  - n: 4
    action: |
      Paginate to last page.
    expected: |
      Last page returns expected tail.
expected_overall: |
  Part list is usable for normal engineering / procurement workflows.
pass_criteria: |
  Search / filter / sort / paginate all work correctly.
est_minutes: 6
```
