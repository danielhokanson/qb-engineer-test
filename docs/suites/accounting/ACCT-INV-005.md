## ACCT-INV-005 — Cycle-count variance posts to inventory adjustment

```yaml
id: ACCT-INV-005
title: A cycle count that finds a discrepancy posts the variance to an inventory-adjustment account
goal: |
  Verify that when the user enters a cycle-count result that differs
  from the system on-hand quantity, the inventory value adjusts to
  match the counted quantity (at the item's unit cost) and the
  variance — positive or negative — posts to an inventory-adjustment
  expense (or income) account.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Floor Operator
preconditions:
  - At least one item with system on-hand of 10 at unit cost $40.00
    exists.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note inventory value for the item and the period
      inventory-adjustment expense total.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Enter a cycle count of 8 (a $80.00 shortfall versus system).
    expected: |
      The user is shown the variance in plain language ("counted 8,
      system showed 10, shortage of 2 units worth $80.00"). The user
      confirms the count.
  - n: 3
    action: |
      Re-check the figures.
    expected: |
      On-hand is now 8. Inventory value decreased by $80.00.
      Inventory-adjustment expense increased by $80.00.
  - n: 4
    action: |
      Repeat with a cycle count of 11 (a $40.00 overage versus
      system) on a different item.
    expected: |
      Variance treated as an income or contra-expense to the
      inventory-adjustment account. Inventory value up by $40.00,
      adjustment expense down by $40.00 (or adjustment income up).
expected_overall: |
  Both shortfall and overage variances post correctly with full
  visibility.
pass_criteria: |
  Shortfall posts $80.00 to adjustment expense AND overage posts
  $40.00 in the opposite direction AND inventory values match counts.
est_minutes: 8
```
