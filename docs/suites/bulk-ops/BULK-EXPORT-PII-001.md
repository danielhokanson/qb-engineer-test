## BULK-EXPORT-PII-001 — Bulk export respects field-level PII restrictions

```yaml
id: BULK-EXPORT-PII-001
title: Bulk export from a customer or employee list omits restricted PII fields
goal: |
  Verify that when a user without the PII permission exports a
  customer or employee list, fields flagged as restricted PII
  (e.g., national ID, full bank account, date of birth) are
  omitted from the export entirely or masked, while a privileged
  user gets the full data set.
roles:
  - Administrator
  - Sales / Account Manager
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-MD-EMPLOYEES
  - CAP-CROSS-PERMS-MATRIX
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-BULK-OPS
preconditions:
  - Customer or employee list contains at least one row with PII-
    classified fields populated.
  - |
    Two test users exist: User A without the PII permission, User
    B with it.
steps:
  - n: 1
    action: |
      Sign in as User A. Open the list. Export it.
    expected: |
      Restricted PII fields are absent from the file or masked
      (e.g., last 4 digits only). The exported row count matches
      the on-screen count.
  - n: 2
    action: |
      Sign in as User B. Open the list. Export.
    expected: |
      Restricted PII fields are present in the file. Row count
      matches.
  - n: 3
    action: |
      Compare the two exports column-for-column.
    expected: |
      Difference is limited to PII columns. Other columns are
      identical for the same row set.
expected_overall: |
  Export honors field-level permissions. Privilege does not leak
  through bulk export.
pass_criteria: |
  PII suppressed for non-privileged user AND visible for privileged
  user AND no row count differences.
est_minutes: 8
```
