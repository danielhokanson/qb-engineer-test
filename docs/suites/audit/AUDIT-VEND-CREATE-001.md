## AUDIT-VEND-CREATE-001 — New vendor creation is logged

```yaml
id: AUDIT-VEND-CREATE-001
title: Creating a vendor records actor, target, and initial values
goal: |
  Verify that creating a new vendor logs actor, timestamp, target
  vendor ID, and the initial field values.
roles:
  - Procurement
  - Administrator
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A user with permission to create vendors exists.
steps:
  - n: 1
    action: |
      Create a new vendor with name, remit-to address, payment terms,
      and tax ID. Save.
    expected: |
      Vendor saves successfully.
  - n: 2
    action: |
      Open the audit log filtered to vendor events for this record.
    expected: |
      Creation entry is present with actor, timestamp, target vendor
      ID / name, and the initial values recorded as the "after" state.
expected_overall: |
  Vendor creation is fully attributed.
pass_criteria: |
  Creation entry present AND captures actor, timestamp, target, and
  initial values.
est_minutes: 4
```
