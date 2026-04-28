## AUDIT-RECEIPT-001 — PO receipt posting is logged

```yaml
id: AUDIT-RECEIPT-001
title: Posting a PO receipt records actor, lines received, and quantities
goal: |
  Verify that posting a goods receipt against a PO records actor,
  timestamp, source PO, lines received, quantities, and the resulting
  inventory effect.
roles:
  - Receiving / Warehouse
capabilities:
  - CAP-P2P-RECEIVE
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - An issued PO with at least two lines exists.
prerequisite_cases:
  - AUDIT-PO-CREATE-001
steps:
  - n: 1
    action: |
      Post a partial receipt against the PO. Receive less than ordered
      on at least one line.
    expected: |
      Receipt posts.
  - n: 2
    action: |
      Open the receipt's audit log entry (or the PO's history filtered
      to receipts).
    expected: |
      Receipt entry shows actor, timestamp, source PO, each line received
      with quantity, and a reference to the inventory transaction.
expected_overall: |
  Goods receipts are fully attributed and tied to the source PO.
pass_criteria: |
  Receipt entry present AND captures actor, timestamp, line detail,
  and inventory linkage.
est_minutes: 5
```
