## P3-PO-SHORTCLOSE-001 — Short-close a partially received PO

```yaml
id: P3-PO-SHORTCLOSE-001
title: Short-close a PO with remaining quantity unfilled
goal: |
  Verify that when a vendor cannot deliver the balance of a PO, the
  buyer can short-close the PO so the line stops appearing on
  on-order, GR/IR clears properly, and any remaining commitment is
  released.
roles:
  - Procurement
flows:
  - part-to-inventory
preconditions:
  - A PO has a partially received line (e.g., 60 of 100 received).
prerequisite_cases:
  - P3-RECV-002
steps:
  - n: 1
    action: |
      Open the partially received PO. Use the short-close action with
      a reason ("vendor cannot supply").
    expected: |
      Short-close is accepted. PO transitions to closed. Remaining
      40 are no longer on-order.
  - n: 2
    action: |
      Run the open-PO list.
    expected: |
      The PO is no longer present.
  - n: 3
    action: |
      Run the GR/IR aging.
    expected: |
      Only the actually received 60 are on GR/IR (or its equivalent).
      The unfilled 40 do not leave a phantom GR/IR balance.
expected_overall: |
  Short-close cleanly removes commitment without leaving GL phantoms.
pass_criteria: |
  PO closed AND open-PO list cleared AND GR/IR reflects only what
  was received.
est_minutes: 6
negative_variants:
  - id: P3-PO-SHORTCLOSE-001-N1
    title: Short-close requires a reason
    action: |
      Try to short-close without entering a reason.
    expected: |
      Save is blocked with a clear "reason is required" message.
    pass_criteria: |
      Short-close without reason refused.
  - id: P3-PO-SHORTCLOSE-001-N2
    title: Cannot short-close after vendor invoice booked for full quantity
    action: |
      Book a vendor invoice for the full ordered quantity, then try
      to short-close.
    expected: |
      Short-close is blocked with a clear "invoice booked for the
      full amount; reverse the invoice first" message.
    pass_criteria: |
      Short-close gated by invoiced quantity.
```
