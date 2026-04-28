## AUDIT-PO-CREATE-001 — New PO creation is logged

```yaml
id: AUDIT-PO-CREATE-001
title: Creating and issuing a PO records actor and full initial state
goal: |
  Verify that creating and issuing a PO logs actor, timestamp, target
  PO number, vendor, and the full set of lines (part, qty, price) as
  the initial "after" state.
roles:
  - Procurement
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active vendor and one purchasable part exist.
steps:
  - n: 1
    action: |
      Create a new PO for an existing vendor with at least two lines.
      Issue the PO.
    expected: |
      PO is issued.
  - n: 2
    action: |
      Open the PO's audit log / history.
    expected: |
      Creation and issue entries are present. Each shows actor, timestamp,
      and the relevant state. The creation entry lists the full line
      detail as the initial state.
expected_overall: |
  PO creation and issue are fully attributed.
pass_criteria: |
  Creation entry present with full line detail AND issue entry present
  with actor and timestamp.
est_minutes: 5
```
