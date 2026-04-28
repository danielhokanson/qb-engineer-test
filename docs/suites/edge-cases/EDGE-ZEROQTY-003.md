## EDGE-ZEROQTY-003 — Zero-dollar invoice (e.g., warranty replacement) posts cleanly without breaking AR

```yaml
id: EDGE-ZEROQTY-003
title: A $0 customer invoice (warranty replacement) records the shipment without inflating AR
goal: |
  Verify that a customer invoice intentionally totaling $0 — for
  example, a warranty replacement where the customer is not charged —
  records the shipment in inventory and on the customer's transaction
  history without creating a $0 open AR row that clutters aging.
roles:
  - AR Clerk
  - Controller
capabilities:
  - CAP-O2C-INVOICE
  - CAP-O2C-COLLECTIONS
preconditions:
  - At least one customer with at least one shipped item.
  - A workflow path for warranty / no-charge shipment exists, OR a
    standard invoice can be issued at $0.
steps:
  - n: 1
    action: |
      Create a customer invoice with one line: 1 unit at $0.
    expected: |
      The application accepts the $0 invoice OR routes it to a
      "no-charge" document type. Either way, the document is
      auditable.
  - n: 2
    action: |
      Inspect inventory: the 1 unit shipped depleted on-hand
      correctly.
    expected: |
      Inventory reflects the shipment.
  - n: 3
    action: |
      Inspect AR aging.
    expected: |
      The $0 invoice either does NOT appear in AR aging at all (it has
      no balance), OR appears with $0 in the right age bucket and is
      filtered out of aging totals. No phantom open balance accrues.
  - n: 4
    action: |
      Inspect GL postings.
    expected: |
      Cost of goods sold posts (the inventory left the building);
      revenue posts $0; AR posts $0. No imbalance.
expected_overall: |
  Zero-dollar shipments record economic reality (COGS, inventory)
  without polluting AR aging.
pass_criteria: |
  Inventory depleted AND COGS posted AND AR aging not cluttered with
  $0 open rows AND GL balanced.
why_this_matters: |
  Warranty and sample shipments are real cost events even when no
  invoice is charged. The system has to handle them without forcing
  the user to either fake-charge or skip the GL impact.
est_minutes: 8
```
