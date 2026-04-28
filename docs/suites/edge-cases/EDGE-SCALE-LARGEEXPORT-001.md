## EDGE-SCALE-LARGEEXPORT-001 — Bulk export of a large dataset completes without truncation

```yaml
id: EDGE-SCALE-LARGEEXPORT-001
title: A large data export (5,000+ rows) downloads without truncation or timeout
goal: |
  Verify a bulk export from a list view (e.g., parts CSV / Excel)
  completes for a 5,000-row dataset and the file contains every row
  represented in the source view.
roles:
  - Administrator
  - Controller
capabilities:
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-LIST-UX
preconditions:
  - 5,000+ records exist for the entity being exported.
steps:
  - n: 1
    action: |
      Open the parts list. Trigger an export to CSV (or Excel) of all
      rows.
    expected: |
      Export starts. The application either streams the file or shows
      progress / completion notice rather than appearing to hang.
  - n: 2
    action: |
      Wait for completion. Download the file. Open it.
    expected: |
      File opens. Row count (excluding header) equals the list view's
      total count.
  - n: 3
    action: |
      Spot-check a row from the middle and a row from the end of the
      file against the source.
    expected: |
      Both rows match the source. No silent truncation.
expected_overall: |
  Bulk export is faithful and complete at scale.
pass_criteria: |
  File row count equals source count AND spot-checked rows match.
why_this_matters: |
  Exports that silently truncate at, say, 1,000 rows are common —
  and the user usually only finds out when their report's totals
  are wrong.
est_minutes: 8
```
