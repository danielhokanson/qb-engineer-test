## ACCT-JE-002 — Reversing a manual adjustment undoes its effect

```yaml
id: ACCT-JE-002
title: Reversing a posted manual adjustment cleanly undoes the original entry
goal: |
  Verify that when the user reverses a previously posted manual
  adjustment, the application creates a counter-entry of the same
  total in the opposite direction so the affected account balances
  return to their pre-adjustment values, and both entries remain
  visible for audit.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
preconditions:
  - At least one posted manual adjustment exists (use ACCT-JE-001's).
prerequisite_cases:
  - ACCT-JE-001
steps:
  - n: 1
    action: |
      Note the affected account balances before reversal.
    expected: |
      Values visible. Record them.
  - n: 2
    action: |
      Open the original adjustment and choose "Reverse". Confirm and
      pick a reversal date within the current open period.
    expected: |
      A new entry is created with the same lines but in the opposite
      direction. The original entry remains in history; the reversal
      is linked to it.
  - n: 3
    action: |
      Re-check the affected account balances.
    expected: |
      Each balance returned exactly to the value it held before the
      original adjustment.
expected_overall: |
  Reversal nets the original adjustment to zero impact and preserves
  full history.
pass_criteria: |
  Reversal entry posted AND each affected balance back to pre-original
  level AND both entries visible in history with a link between them.
est_minutes: 5
```
