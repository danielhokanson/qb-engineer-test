## LIST-EMP-005 — Employee list: column show/hide

```yaml
id: LIST-EMP-005
title: Employee list columns can be shown, hidden, and reordered
goal: |
  Verify the employee list lets the user tailor visible columns
  (e.g., hide salary, show shift / supervisor / hire date) and that
  the choice persists per-user. Sensitive columns respect
  permissions even when shown.
roles:
  - HR / People Ops
  - Administrator
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - Employee list view is open. Test user has permission to view
    the columns being toggled.
steps:
  - n: 1
    action: |
      Open the column chooser. Hide one default column and show
      shift, supervisor, and hire date.
    expected: |
      List redraws with the chosen columns.
  - n: 2
    action: |
      Reorder columns so name is first, department is second.
    expected: |
      Column order updates.
  - n: 3
    action: |
      Reload the page.
    expected: |
      Column visibility and order persist for this user.
  - n: 4
    action: |
      As a non-HR user, attempt to show a sensitive column (e.g.,
      salary).
    expected: |
      Sensitive column is either not offered in the chooser, or is
      shown masked. No leak of sensitive data.
  - n: 5
    action: |
      Reset columns to default.
    expected: |
      Default column set restored.
expected_overall: |
  Column tailoring is usable for HR / admin workflows and respects
  data-sensitivity boundaries.
pass_criteria: |
  Show / hide / reorder works, persists per-user, and sensitive
  columns are gated by permissions.
est_minutes: 6
```
