## ACCT-INV-002 — Issuing material to a work order moves value from inventory to WIP

```yaml
id: ACCT-INV-002
title: Issuing parts to a work order moves their value from raw inventory to work-in-process
goal: |
  Verify that when the user issues raw material to an open work
  order, the raw inventory value decreases by the issued cost and
  the work-in-process (WIP) value increases by the same amount,
  preserving total asset value.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Floor Operator
preconditions:
  - At least one open work order exists.
  - At least one raw-material item with sufficient on-hand stock and
    a known unit cost exists.
prerequisite_cases:
  - ACCT-SETUP-001
  - ACCT-INV-001
steps:
  - n: 1
    action: |
      Note raw inventory value and WIP value.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Issue 5 units of the raw material at $40.00 each (total $200.00)
      to the open work order.
    expected: |
      The issue is accepted. Raw on-hand decreases by 5.
  - n: 3
    action: |
      Re-check raw inventory value and WIP value.
    expected: |
      Raw inventory value decreased by exactly $200.00. WIP value
      increased by exactly $200.00. Total assets unchanged.
expected_overall: |
  Material issue is a transfer between two asset buckets, not a
  consumption.
pass_criteria: |
  Raw inventory down by $200.00 AND WIP up by $200.00 AND total assets
  flat.
why_this_matters: |
  Issuing material straight to expense (skipping WIP) overstates cost
  of goods on the day of issue rather than on the day of completion.
est_minutes: 6
```
