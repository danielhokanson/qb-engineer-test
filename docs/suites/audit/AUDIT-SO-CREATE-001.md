## AUDIT-SO-CREATE-001 — New sales order creation is logged

```yaml
id: AUDIT-SO-CREATE-001
title: Creating and confirming a sales order records actor and lines
goal: |
  Verify that creating and confirming a sales order logs actor,
  timestamp, target SO number, customer, and the full line detail
  (part, qty, price) as the initial state.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-O2C-SO
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active customer and one sellable part exist.
steps:
  - n: 1
    action: |
      Create a new SO for an existing customer with at least two lines.
      Confirm the SO.
    expected: |
      SO is confirmed.
  - n: 2
    action: |
      Open the SO's audit log.
    expected: |
      Creation and confirmation entries are present, each with actor
      and timestamp. Creation entry lists the full line detail.
expected_overall: |
  SO creation and confirmation are fully attributed.
pass_criteria: |
  Creation entry present with full line detail AND confirmation entry
  present with attribution.
est_minutes: 5
```
