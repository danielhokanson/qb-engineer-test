## ACCT-SETUP-003 — Choose cash-basis or accrual-basis accounting

```yaml
id: ACCT-SETUP-003
title: Pick cash basis or accrual basis at setup
goal: |
  Verify that the shop owner can choose between cash-basis and
  accrual-basis accounting, that the choice is explained in plain
  language, and that reports honor the choice.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Administrator
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-RPT-FINANCIALS
preconditions:
  - The chart of accounts has been initialized (ACCT-SETUP-001).
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Open the accounting basis setting.
    expected: |
      Two options are offered — cash and accrual — each with a
      one-sentence plain-language explanation. No jargon ("realized",
      "matching principle") is required to make the choice.
  - n: 2
    action: |
      Select cash basis and save.
    expected: |
      The selection is accepted.
  - n: 3
    action: |
      Run a profit-and-loss report covering the current period.
    expected: |
      The report header indicates cash basis. Income reflects only
      cash actually received; expenses reflect only cash actually paid.
expected_overall: |
  Basis choice is selectable in plain language and drives report
  behavior.
pass_criteria: |
  Cash basis selected AND P&L explicitly identifies itself as cash
  basis AND figures match cash-basis treatment.
why_this_matters: |
  Most small shops file taxes on a cash basis. Forcing accrual
  bookkeeping creates a mismatch between books and tax return.
est_minutes: 5
```
