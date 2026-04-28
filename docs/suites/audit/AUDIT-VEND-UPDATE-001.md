## AUDIT-VEND-UPDATE-001 — Vendor field updates record before / after

```yaml
id: AUDIT-VEND-UPDATE-001
title: Updating vendor remit-to address and tax ID is logged with diff
goal: |
  Verify that updating a vendor's remit-to address and tax ID records
  each changed field with prior and new values, actor, and timestamp.
roles:
  - Procurement
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active vendor exists.
prerequisite_cases:
  - AUDIT-VEND-CREATE-001
steps:
  - n: 1
    action: |
      Open the vendor. Change the remit-to address. Change the tax ID.
      Save.
    expected: |
      Changes save.
  - n: 2
    action: |
      Open the vendor's audit log.
    expected: |
      Update entry shows actor, timestamp, and a diff for each changed
      field with prior and new values.
expected_overall: |
  Vendor field updates produce a clear field-level diff.
pass_criteria: |
  Both changed fields show prior and new values AND unchanged fields
  are not listed.
est_minutes: 4
```
