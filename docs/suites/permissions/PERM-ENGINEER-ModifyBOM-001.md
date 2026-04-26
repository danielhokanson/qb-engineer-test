## PERM-ENGINEER-ModifyBOM-001 — Engineer can modify a released BOM (creates revision)

```yaml
id: PERM-ENGINEER-ModifyBOM-001
title: Engineer is allowed to modify a released BOM
goal: |
  Verify an Engineer / R&D user can change a released BOM and that the
  change creates a new revision rather than overwriting the live one.
roles:
  - Engineer / R&D
preconditions:
  - An Engineer / R&D user exists.
  - A finished part has a released BOM at revision A.
steps:
  - n: 1
    action: |
      Sign in as Engineer. Open the BOM. Increase a component quantity.
      Save.
    expected: |
      Save succeeds. A new revision (B) is created. Revision A is
      preserved as the prior version.
  - n: 2
    action: |
      Open the BOM history.
    expected: |
      Both revisions are visible with their effective dates and the
      Engineer user attributed to revision B.
expected_overall: |
  Engineer modifies a BOM; modification is versioned and audited.
pass_criteria: |
  New revision created AND prior revision preserved AND audit shows
  the user.
est_minutes: 5
```
