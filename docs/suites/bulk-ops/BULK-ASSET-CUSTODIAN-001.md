## BULK-ASSET-CUSTODIAN-001 — Mass-reassign fixed assets to a new custodian

```yaml
id: BULK-ASSET-CUSTODIAN-001
title: Reassign fixed assets in a department to a new custodian
goal: |
  Verify an asset administrator can mass-reassign a department's
  fixed assets to a new custodian, that any asset under active
  maintenance work order is excluded or flagged, and that each
  reassignment is audit-logged.
roles:
  - Asset Administrator
  - Maintenance Manager
capabilities:
  - CAP-MD-ASSETS
  - CAP-MAINT-ASSETLIFECYCLE
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 6 fixed assets exist in Department X with custodian =
    Person A.
  - At least 1 of them has an open maintenance WO.
  - Person B exists.
steps:
  - n: 1
    action: |
      Filter assets to "department = X AND custodian = Person A."
      Select all. Choose mass-reassign custodian. Set new custodian
      = Person B.
    expected: |
      Stage preview shows affected assets. The asset under open
      maintenance is flagged.
  - n: 2
    action: |
      Confirm.
    expected: |
      Eligible assets reassigned to Person B. The asset under open
      maintenance is rejected (or held with reason "Open maintenance
      WO"). Per-row outcome shown.
  - n: 3
    action: |
      Spot-check one reassigned asset's record and audit log.
    expected: |
      Custodian = Person B. Audit captures prior and new custodian,
      who, when.
expected_overall: |
  Asset custodian reassignment respects open maintenance and audits
  per asset.
pass_criteria: |
  Eligible assets reassigned AND open-maintenance asset preserved AND
  audit per asset.
est_minutes: 7
```
