## EDGE-NEGQTY-003 — Negative quantity on a purchase receipt is rejected, not stored

```yaml
id: EDGE-NEGQTY-003
title: A receipt entry with a negative quantity is rejected at entry, not stored as a positive or as -N
goal: |
  Verify that an attempt to receive a negative quantity against a
  purchase order is rejected with a clear error, not silently
  converted to a positive (which would over-receive) or accepted
  as -N (which would corrupt inventory).
roles:
  - Receiving Clerk
  - Procurement
capabilities:
  - CAP-P2P-RECEIVE
preconditions:
  - At least one open PO with a remaining quantity to receive.
steps:
  - n: 1
    action: |
      On the PO receipt form, attempt to enter a quantity of -5.
    expected: |
      Form rejects the entry with a clear validation message
      (something like "Receipt quantity must be positive").
  - n: 2
    action: |
      Confirm no record was created — the receipt was not silently
      stored as -5 or as 5.
    expected: |
      No new receipt exists. Inventory is unchanged.
  - n: 3
    action: |
      Identify the legitimate path for "I receipted too much" — e.g.,
      a vendor return or a receipt reversal.
    expected: |
      Such a path exists, is gated by permission, and is auditable.
      It does NOT require the user to enter a negative receipt
      quantity.
expected_overall: |
  Negative receipts are rejected; reversals go through a documented
  separate path.
pass_criteria: |
  Negative quantity rejected AND no record stored AND a separate
  audited reversal path exists.
why_this_matters: |
  Allowing negative receipts to "fix" over-receipts conflates two
  concepts and breaks audit. The right answer is to reject the
  shortcut and require the proper reversal flow.
est_minutes: 6
```
