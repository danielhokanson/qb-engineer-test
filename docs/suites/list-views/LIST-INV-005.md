## LIST-INV-005 — Invoice list: column show/hide

```yaml
id: LIST-INV-005
title: Invoice list columns can be shown, hidden, and reordered
goal: |
  Verify the invoice list lets the user tailor visible columns
  (e.g., hide internal notes, show aging bucket and customer PO
  number) and that the choice persists per-user.
roles:
  - Controller
  - AR / Collections
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-LIST-UX
preconditions:
  - Invoice list view is open with the default column set.
steps:
  - n: 1
    action: |
      Open the column chooser. Hide one default column and show
      aging bucket plus customer PO number.
    expected: |
      List redraws with the chosen columns.
  - n: 2
    action: |
      Reorder columns so customer name is first, amount due is
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
      Confirm hidden columns remain available as filter / sort
      targets.
    expected: |
      Hidden columns still selectable in filter / sort menus.
  - n: 5
    action: |
      Reset columns to default.
    expected: |
      Default column set restored.
expected_overall: |
  Users can tailor the invoice list to their AR workflow.
pass_criteria: |
  Show / hide / reorder works, persists per-user, and does not
  remove fields from filter / sort.
est_minutes: 5
```
