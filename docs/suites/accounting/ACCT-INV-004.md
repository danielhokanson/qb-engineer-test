## ACCT-INV-004 — Scrap writes off inventory value to a scrap-loss expense

```yaml
id: ACCT-INV-004
title: Recording scrap reduces inventory and posts the loss to a scrap-expense account
goal: |
  Verify that when the user records scrapped material or scrapped
  finished goods, the corresponding inventory value decreases by
  the scrapped cost and a scrap-loss (or inventory-adjustment)
  expense increases by the same amount.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Floor Operator
preconditions:
  - At least one item with on-hand stock and a known unit cost exists.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note the on-hand quantity and inventory value for the item, and
      the period scrap-loss expense total.
    expected: |
      All three values visible. Record them.
  - n: 2
    action: |
      Record scrap of 2 units at $40.00 each (total $80.00) with a
      reason of "damaged in handling".
    expected: |
      The scrap entry is accepted. The user can pick a reason in
      plain language. On-hand quantity decreases by 2.
  - n: 3
    action: |
      Re-check the figures.
    expected: |
      Inventory value decreased by exactly $80.00. Scrap-loss expense
      increased by exactly $80.00.
expected_overall: |
  Scrap correctly turns inventory value into recognized expense.
pass_criteria: |
  On-hand down by 2 AND inventory value down by $80.00 AND scrap-loss
  expense up by $80.00.
est_minutes: 5
```
