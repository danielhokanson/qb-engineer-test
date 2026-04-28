## NOTIF-PM-OVERDUE-003 — PM overdue alert reaches asset owner channel

```yaml
id: NOTIF-PM-OVERDUE-003
title: Overdue PM notifies the asset owner per asset notification config
goal: |
  Verify that when an asset has a designated owner / cost-center
  contact, an overdue PM on that asset notifies that owner in addition
  to maintenance staff.
roles:
  - Maintenance Manager
  - Production Supervisor
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-MAINT-PM
  - CAP-MD-ASSETS
preconditions:
  - An asset has an owner / cost-center contact configured.
  - A PM is scheduled against that asset.
prerequisite_cases:
  - P5-PM-001
  - NOTIF-PM-OVERDUE-001
steps:
  - n: 1
    action: |
      Backdate the PM so it is past due. Confirm the asset has its
      owner contact set.
    expected: |
      The maintenance manager and the asset owner both receive the
      overdue alert.
  - n: 2
    action: |
      Reassign the asset owner to a different user.
    expected: |
      Subsequent overdue notifications go to the new owner; prior alert
      history stays attributed to the previous owner.
expected_overall: |
  Asset ownership drives correct alert routing for PMs.
pass_criteria: |
  Asset owner is included in routing AND owner reassignment redirects
  future alerts AND prior alert history is preserved.
est_minutes: 7
```
