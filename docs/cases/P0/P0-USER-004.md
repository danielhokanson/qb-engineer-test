## P0-USER-004 — Bulk-provision users from a CSV

```yaml
id: P0-USER-004
title: Provision multiple users from a CSV upload
goal: |
  Verify an IT Admin can create a batch of users (e.g., 25) from a
  CSV file with names, emails, and roles, and that errors on
  individual rows are flagged without blocking the whole import.
roles:
  - IT Admin
  - Administrator
flows:
  - tenant-onboarding
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one role exists for the new users to be assigned to.
prerequisite_cases:
  - P0-USER-001
steps:
  - n: 1
    action: |
      Find the user import area. Download the CSV template.
    expected: |
      Template is available. Required columns are documented.
  - n: 2
    action: |
      Fill in 25 plausible users — 23 valid, 2 with intentional
      errors (one with an invalid email, one with a non-existent
      role). Upload the file.
    expected: |
      The application shows a preview / validation summary. The 2
      bad rows are flagged with line number and the reason. Valid
      rows are queued.
  - n: 3
    action: |
      Confirm the import.
    expected: |
      23 users are created. Invitations or temporary credentials are
      issued. The 2 bad rows are not silently skipped — they appear
      in an error list with actionable detail.
  - n: 4
    action: |
      Open the user list. Verify the 23 new users.
    expected: |
      All 23 visible with their assigned roles.
expected_overall: |
  Bulk user provisioning works with row-level error reporting.
pass_criteria: |
  23 users created AND 2 bad rows reported with reasons AND no
  silent partial failures.
est_minutes: 12
negative_variants:
  - id: P0-USER-004-N1
    title: Reject CSV with missing required columns
    action: |
      Upload a CSV missing the "email" column.
    expected: |
      The import is blocked at validation with a clear message naming
      the missing required column. No users are created.
    pass_criteria: |
      Import blocked AND missing column is named.
  - id: P0-USER-004-N2
    title: Reject CSV with duplicate emails inside the file
    action: |
      Upload a CSV where two rows share the same email address.
    expected: |
      The duplicates are flagged at validation. The application
      either rejects the import or imports the first occurrence and
      reports the second as a row-level error.
    pass_criteria: |
      Duplicate rows are flagged AND the resolution is explicit.
  - id: P0-USER-004-N3
    title: Reject oversized upload
    action: |
      Upload a CSV well above the documented row limit (e.g.,
      100,000 rows if the limit is 5,000).
    expected: |
      The import is rejected at upload with a clear "file too large"
      or "row count exceeds limit" message naming the limit.
    pass_criteria: |
      Oversize upload refused AND the limit is communicated.
```
