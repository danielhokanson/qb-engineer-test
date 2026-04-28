## ACCT-INV-003 — Completing a work order moves value from WIP to finished goods

```yaml
id: ACCT-INV-003
title: Completing a work order moves accumulated WIP to finished-goods inventory
goal: |
  Verify that when the user marks a work order complete, the
  accumulated WIP cost (materials, plus any labor or overhead
  applied) moves to finished-goods inventory at the same total
  value, with no leakage.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Floor Operator
capabilities:
  - CAP-MFG-COMPLETE
  - CAP-INV-CORE
  - CAP-ACCT-FULLGL
preconditions:
  - One open work order with material already issued exists. WIP
    value attributable to the WO is known (e.g., $200.00 from
    ACCT-INV-002).
prerequisite_cases:
  - ACCT-INV-002
steps:
  - n: 1
    action: |
      Note WIP value and finished-goods inventory value.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Mark the work order complete with the produced quantity that
      consumes the full WIP balance for that order.
    expected: |
      The work order's status changes to complete. Produced units
      appear in finished-goods on-hand.
  - n: 3
    action: |
      Re-check the figures.
    expected: |
      WIP attributable to the WO returns to zero. Finished-goods
      inventory value increased by the WIP-consumed amount (e.g.,
      $200.00). Total assets unchanged.
expected_overall: |
  Completion transfers WIP to finished goods at full value.
pass_criteria: |
  WIP for the WO returns to zero AND finished-goods value increased
  by the consumed WIP amount AND total assets flat.
est_minutes: 6
```
