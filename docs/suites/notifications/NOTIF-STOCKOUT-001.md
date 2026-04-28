## NOTIF-STOCKOUT-001 — Stockout alert when on-hand reaches zero with open demand

```yaml
id: NOTIF-STOCKOUT-001
title: Part hitting zero on-hand with open demand fires a stockout alert
goal: |
  Verify that when a part's on-hand drops to zero while open demand
  (sales orders, work orders, transfers) still references it, a
  stockout alert fires — distinct from low-stock — to procurement
  and to demand owners (sales, production planner).
roles:
  - Procurement
  - Sales / Account Manager
  - Production Planner
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-INV-CORE
preconditions:
  - A part has open demand (at least one sales order or work order
    requiring it) and on-hand can be driven to zero.
prerequisite_cases:
  - P3-SS-001
  - NOTIF-LOWSTOCK-001
steps:
  - n: 1
    action: |
      Issue or adjust on-hand to zero while demand remains open.
    expected: |
      A stockout alert fires (distinct from any low-stock alert) to
      procurement and demand owners. The alert references at least one
      affected order.
  - n: 2
    action: |
      Receive stock to bring on-hand above zero.
    expected: |
      Stockout alert clears. (Low-stock alert may remain if still under
      reorder point.)
  - n: 3
    action: |
      Drive on-hand back to zero with no open demand on the part.
    expected: |
      No stockout alert fires (because there's nothing being blocked).
expected_overall: |
  Stockout alert is reserved for the case that on-hand zero is
  blocking real demand.
pass_criteria: |
  Alert fires when zero-on-hand blocks demand AND clears on receipt
  AND does not fire when no demand is impacted.
est_minutes: 8
```
