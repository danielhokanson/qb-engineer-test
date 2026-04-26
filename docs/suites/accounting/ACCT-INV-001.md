## ACCT-INV-001 — Receipt increases inventory and creates a goods-received-not-billed liability

```yaml
id: ACCT-INV-001
title: Recording a stock receipt increases inventory and accrues a pending vendor liability
goal: |
  Verify that when stock is received (before the vendor bill arrives),
  inventory on hand and inventory value increase by the received
  cost, and a "goods received, not yet billed" pending liability
  records the same value so AP is captured correctly when the bill
  later arrives.
optional_module: builtin-accounting
roles:
  - Shop Owner
  - Receiving Clerk
preconditions:
  - At least one stocked item with a known unit cost exists.
  - At least one active vendor exists.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note inventory value, on-hand quantity for the item, and the
      current "goods received, not yet billed" pending liability.
    expected: |
      All three values visible. Record them.
  - n: 2
    action: |
      Record a receipt of 5 units at $40.00 each (total $200.00).
      Do not record a vendor bill yet.
    expected: |
      The receipt is accepted. On-hand quantity increases by 5.
      Inventory value increases by $200.00. Pending liability
      increases by $200.00.
  - n: 3
    action: |
      Confirm the figures.
    expected: |
      Quantity, inventory value, and pending liability all updated
      correctly. AP itself has not yet moved — that waits for the
      vendor bill.
expected_overall: |
  Receipt creates inventory and a pending liability without forcing a
  vendor bill to exist.
pass_criteria: |
  On-hand up by 5 AND inventory value up by $200.00 AND pending
  liability up by $200.00 AND AP unchanged.
est_minutes: 5
```
