## ACCT-AP-003 — Vendor bill arising from an inventory receipt

```yaml
id: ACCT-AP-003
title: Receiving inventory and matching to a vendor bill increases inventory and AP
goal: |
  Verify that when the user receives stock from a vendor and then
  records the matching bill, inventory value increases by the
  received cost, accounts payable increases by the bill total, and
  no double-counting occurs.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AP Clerk
  - Receiving Clerk
capabilities:
  - CAP-P2P-RECEIVE
  - CAP-INV-CORE
  - CAP-ACCT-FULLGL
preconditions:
  - At least one stocked item with a known unit cost exists.
  - At least one active vendor exists.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Record a goods receipt of 10 units at $20.00 each (total cost
      $200.00) from the vendor.
    expected: |
      The receipt is recorded. Inventory on hand for that item
      increases by 10 units. Inventory value increases by $200.00.
      A pending liability ("Goods received, not yet billed" or
      similar plain-language label) of $200.00 is shown.
  - n: 2
    action: |
      Record the matching vendor bill for $200.00 against that
      receipt.
    expected: |
      The pending liability is replaced by an open vendor bill of
      $200.00. AP increases by $200.00.
  - n: 3
    action: |
      Check inventory value, AP, and the pending-liability total.
    expected: |
      Inventory value still up by $200.00 (not double-counted). AP
      shows $200.00. Pending liability is back to zero.
expected_overall: |
  Receipt creates a pending liability; matching the bill converts it
  to AP without inflating inventory or AP totals.
pass_criteria: |
  Inventory value up by $200.00 once AND AP up by $200.00 AND no
  duplicate liability remaining.
why_this_matters: |
  Without a receipt-to-bill match, the shop either pays before
  recording stock (inventory missing) or records bills twice
  (overstated payables). Either error is expensive to undo.
est_minutes: 7
```
