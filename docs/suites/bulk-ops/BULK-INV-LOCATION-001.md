## BULK-INV-LOCATION-001 — Mass-transfer inventory between locations

```yaml
id: BULK-INV-LOCATION-001
title: Bulk-move inventory from one location to another
goal: |
  Verify a warehouse supervisor can mass-transfer on-hand inventory
  from a source location to a destination location for a filtered
  set of parts, that the transfer posts inventory transactions per
  part, and any quantity that is reserved or allocated is excluded
  or flagged.
roles:
  - Warehouse Supervisor
  - Inventory Controller
capabilities:
  - CAP-INV-CORE
  - CAP-INV-MULTILOC
  - CAP-CROSS-BULK-OPS
preconditions:
  - Source location has on-hand for at least 6 parts.
  - At least 1 of those parts has a reserved / allocated quantity.
  - Destination location is active.
steps:
  - n: 1
    action: |
      Filter inventory to "location = Source." Select 6 parts.
      Choose mass-transfer. Set destination location.
    expected: |
      Stage preview shows part, source qty, allocated qty, and qty
      eligible to move per row.
  - n: 2
    action: |
      Confirm.
    expected: |
      Unallocated quantity moves to the destination. Allocated
      portion remains at the source with a stated reason. Per-row
      outcome shown.
  - n: 3
    action: |
      Run an inventory-by-location report on both locations.
    expected: |
      Quantities reconcile. Total on-hand across both locations is
      unchanged. Each transfer creates an inventory transaction with
      operation reference.
expected_overall: |
  Mass transfer respects allocations and produces per-row inventory
  transactions.
pass_criteria: |
  Eligible qty moved AND allocated qty preserved AND total on-hand
  unchanged AND audit per transfer.
est_minutes: 9
```
