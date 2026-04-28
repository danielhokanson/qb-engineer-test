## INTEG-FILE-IMP-001 — File-based import (generic CSV / Excel)

```yaml
id: INTEG-FILE-IMP-001
title: Generic file-based import works with row-level error reporting
goal: |
  Verify file-based import for any importable entity (parts,
  vendors, customers, GL accounts) works with documented templates,
  flags row errors with line and column detail, and never silently
  drops bad rows or partial outcomes.
roles:
  - Administrator
capabilities:
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least one importable entity has a documented CSV / Excel
    template.
prerequisite_cases:
  - P2-PART-005
steps:
  - n: 1
    action: |
      Pick an importable entity. Download its template. Fill in 10
      rows: 8 valid, 2 with errors of different types (e.g., missing
      required field, invalid foreign key, duplicate key).
    expected: |
      Template is clear about required vs. optional fields.
  - n: 2
    action: |
      Upload the file.
    expected: |
      Validation summary shows 8 rows ready, 2 errored. Each error
      gives line number, column, and reason.
  - n: 3
    action: |
      Confirm import.
    expected: |
      8 records created. The 2 bad rows are NOT silently skipped —
      they appear in an error report the user can fix and re-upload.
expected_overall: |
  File-based import works with row-level error visibility.
pass_criteria: |
  Valid rows imported AND bad rows reported AND no silent partial
  outcomes.
est_minutes: 10
```
