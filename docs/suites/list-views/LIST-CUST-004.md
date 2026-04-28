## LIST-CUST-004 — Customer list: column show/hide and reorder

```yaml
id: LIST-CUST-004
title: Customer list columns can be shown, hidden, and reordered
goal: |
  Verify the customer list lets the user choose which columns are
  visible and (where supported) reorder them, and that the choice
  persists per-user across reloads.
roles:
  - Sales / Account Manager
  - Administrator
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-LIST-UX
preconditions:
  - Customer list view is open with the default column set.
steps:
  - n: 1
    action: |
      Open the column chooser. Hide three default columns and show
      at least one optional column not in the default set.
    expected: |
      List redraws with the selected columns. Hidden columns are
      gone; optional column appears.
  - n: 2
    action: |
      Reorder columns by dragging (or via the chooser's order
      controls).
    expected: |
      Column order updates in the list.
  - n: 3
    action: |
      Reload the page (or sign out and back in).
    expected: |
      Column visibility and order persist for this user.
  - n: 4
    action: |
      Reset to default columns.
    expected: |
      Default column set is restored.
  - n: 5
    action: |
      Confirm that hiding a column does not affect filter / sort
      capability on that column (filter / sort menu still lists it).
    expected: |
      Hidden columns remain available as filter / sort targets.
expected_overall: |
  Users can tailor the list to their workflow without losing access
  to underlying fields.
pass_criteria: |
  Show / hide / reorder works, persists per-user, and does not
  silently disable filtering or sorting.
est_minutes: 6
```
