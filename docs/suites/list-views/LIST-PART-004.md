## LIST-PART-004 — Part list: column show/hide

```yaml
id: LIST-PART-004
title: Part list columns can be shown, hidden, and reordered
goal: |
  Verify the parts list lets users tailor the visible column set
  (e.g., hide cost, show preferred vendor, show on-hand QoH) and
  that the choice persists per-user.
roles:
  - Engineer / R&D
  - Procurement
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-LIST-UX
preconditions:
  - Parts list view is open with the default column set.
steps:
  - n: 1
    action: |
      Open the column chooser. Hide cost (if visible by default)
      and show preferred vendor and on-hand quantity.
    expected: |
      List redraws with the chosen columns.
  - n: 2
    action: |
      Reorder columns so part number is first and description is
      second.
    expected: |
      Column order updates.
  - n: 3
    action: |
      Reload the page.
    expected: |
      Column visibility and order persist for this user.
  - n: 4
    action: |
      Verify that filter / sort menus still expose hidden columns
      as filterable / sortable.
    expected: |
      Hidden columns remain available as filter / sort targets.
  - n: 5
    action: |
      Reset columns to default.
    expected: |
      Default column set restored.
expected_overall: |
  Engineers and buyers can tailor the parts list to their workflow.
pass_criteria: |
  Show / hide / reorder works, persists per-user, and does not
  remove fields from filter / sort.
est_minutes: 5
```
