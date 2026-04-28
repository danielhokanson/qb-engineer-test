## PERM-WAREHOUSE-ApprovePO-001 — Warehouse cannot approve a PO

```yaml
id: PERM-WAREHOUSE-ApprovePO-001
title: Warehouse / Logistics is denied approving a PO
goal: |
  Verify a user with only the Warehouse / Logistics role cannot
  approve POs (they receive against POs, but do not authorize spend).
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-P2P-APPROVALS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Warehouse user exists.
  - A draft PO awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Warehouse. Open the draft PO (read-only access for
      receiving prep is acceptable).
    expected: |
      The Approve action is hidden, disabled, or not available.
  - n: 2
    action: |
      Attempt to reach the approve endpoint via direct URL.
    expected: |
      Action is rejected. PO remains unapproved.
expected_overall: |
  Warehouse cannot approve POs through any path.
pass_criteria: |
  No approval recorded AND PO state unchanged.
est_minutes: 4
```
