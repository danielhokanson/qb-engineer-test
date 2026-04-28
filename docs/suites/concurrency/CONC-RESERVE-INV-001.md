## CONC-RESERVE-INV-001 — Two reservations on the same stock cannot oversell

```yaml
id: CONC-RESERVE-INV-001
title: Two simultaneous reservations against the same on-hand cannot exceed available
goal: |
  Verify that when two users try to reserve / allocate inventory
  against the same on-hand quantity, the system serializes the
  reservations and the second user gets a clear "insufficient stock"
  message — never allowing the system to oversell.
roles:
  - Sales / Account Manager
  - Warehouse / Logistics
capabilities:
  - CAP-CROSS-CONCURRENCY
  - CAP-INV-RESERVE
preconditions:
  - One part has on-hand quantity of exactly 10.
  - Two users with reservation authority exist.
steps:
  - n: 1
    action: |
      User A: open a draft sales order for the part. Set the quantity
      to 8.
    expected: |
      Draft accepts. Available is shown as 10.
  - n: 2
    action: |
      User B: in a separate session, open another draft order for the
      same part. Set quantity to 5.
    expected: |
      Draft accepts. Available is shown as 10 (or, if B opened after
      A reserved, 2 — depends on whether A has confirmed yet).
  - n: 3
    action: |
      User A: confirm / reserve.
    expected: |
      Reservation succeeds. On-hand or available drops by 8.
  - n: 4
    action: |
      User B: confirm / reserve their order for 5.
    expected: |
      Either: (a) the reservation is rejected with a clear message
      that only 2 are available; or (b) the order is split so 2 are
      reserved and 3 are backordered. Silently reserving 5 (over-
      committing) is the failure mode.
  - n: 5
    action: |
      Open the inventory record. Verify that total reserved cannot
      exceed total on-hand.
    expected: |
      Reserved ≤ on-hand always.
expected_overall: |
  Simultaneous reservations cannot oversell.
pass_criteria: |
  Reserved quantity never exceeds on-hand AND the second user got a
  clear conflict outcome.
why_this_matters: |
  Reservation races are the textbook concurrency bug. An ERP that
  oversells silently is responsible for missed customer commitments
  no one anticipated.
est_minutes: 10
```
