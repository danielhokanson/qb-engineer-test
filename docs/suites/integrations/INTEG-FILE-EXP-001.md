## INTEG-FILE-EXP-001 — File-based export round-trip

```yaml
id: INTEG-FILE-EXP-001
title: Export a list to CSV / Excel and re-import to verify the round-trip
goal: |
  Verify that exporting an entity list to CSV / Excel produces a file
  that can be re-imported (after appropriate edits) without breaking
  references or losing data fidelity.
roles:
  - Administrator
preconditions:
  - At least 20 records of one entity exist.
steps:
  - n: 1
    action: |
      Open the entity list. Export all to CSV.
    expected: |
      File downloads. Header row matches the import template.
  - n: 2
    action: |
      Open the file. Verify the row count equals the source count
      (no truncation).
    expected: |
      Match.
  - n: 3
    action: |
      Edit a non-key field on 5 rows. Save. Re-import.
    expected: |
      Re-import detects the rows as updates (not duplicates),
      updates the modified field, and reports the update count.
expected_overall: |
  File round-trips cleanly.
pass_criteria: |
  Exported = source AND re-import updates correctly AND no
  duplicates created.
est_minutes: 10
```
