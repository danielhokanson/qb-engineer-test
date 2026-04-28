## P3-RESERVE-001 — Reserve inventory against an SO

```yaml
id: P3-RESERVE-001
title: Reserve inventory against a confirmed sales order
goal: |
  Verify on-hand inventory can be reserved against a confirmed SO
  so it cannot be allocated to another order, while still showing
  on-hand for valuation purposes.
roles:
  - Sales / Account Manager
  - Warehouse / Logistics
flows:
  - quote-to-cash
capabilities:
  - CAP-INV-RESERVE
  - CAP-O2C-SO
preconditions:
  - At least one confirmed SO with an in-stock part exists.
prerequisite_cases:
  - P4-QUOTE-003
steps:
  - n: 1
    action: |
      Open the confirmed SO. Reserve / allocate inventory against the
      SO line.
    expected: |
      Reservation succeeds. The inventory record shows on-hand
      unchanged but available reduced by the reserved quantity.
  - n: 2
    action: |
      Try to allocate the same inventory to a different SO.
    expected: |
      Allocation is blocked or warns that available is insufficient.
  - n: 3
    action: |
      Cancel the original SO's reservation.
    expected: |
      Reservation releases. Available equals on-hand again.
expected_overall: |
  Reservation locks supply for committed demand without changing
  total on-hand.
pass_criteria: |
  Available reduces on reservation AND second allocation blocked AND
  release restores availability.
est_minutes: 6
negative_variants:
  - id: P3-RESERVE-001-N1
    title: Reject reservation exceeding on-hand
    action: |
      Try to reserve 999 units when only 50 are on hand.
    expected: |
      Save is blocked with a clear "insufficient on-hand to reserve"
      message naming the available quantity.
    pass_criteria: |
      Over-reservation refused.
  - id: P3-RESERVE-001-N2
    title: Cannot reserve from a cancelled SO
    action: |
      Cancel the SO, then try to create a reservation against it.
    expected: |
      Save is blocked with a "SO is cancelled" message.
    pass_criteria: |
      Reservation against cancelled SO refused.
```
