## ACCT-SETUP-001 — Initialize the chart of accounts with shop-appropriate defaults

```yaml
id: ACCT-SETUP-001
title: First-time setup creates a shop-appropriate chart of accounts
goal: |
  Verify that on first use of the built-in accounting module, the
  shop owner is offered a default chart of accounts (cash, accounts
  receivable, inventory, accounts payable, sales, cost of goods sold,
  payroll expense, owner's equity, retained earnings) and that
  accepting the defaults makes those accounts immediately usable.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Administrator
capabilities:
  - CAP-ACCT-BUILTIN
  - CAP-ACCT-FULLGL
preconditions:
  - The built-in accounting module is enabled at session start.
  - No accounting transactions have been recorded yet.
steps:
  - n: 1
    action: |
      Open the accounting setup area for a new tenant.
    expected: |
      A first-time setup screen offers a default chart of accounts
      tailored to a small manufacturing or trade shop.
  - n: 2
    action: |
      Review the default account list. Accept the defaults.
    expected: |
      A standard set of accounts is created — at minimum cash,
      accounts receivable, inventory, accounts payable, sales,
      cost of goods sold, payroll expense, owner's equity, and
      retained earnings — each with a plain-language name and a
      category (asset / liability / equity / income / expense).
  - n: 3
    action: |
      Open the account list.
    expected: |
      The accepted accounts are listed and active. None are flagged
      as draft or pending.
expected_overall: |
  After accepting defaults, a usable chart of accounts exists with
  no further setup required.
pass_criteria: |
  All default accounts are present, active, and categorized correctly.
why_this_matters: |
  A shop owner without an accountant cannot design a chart of accounts
  from scratch. The defaults must be sensible enough that accepting
  them yields correct books out of the gate.
est_minutes: 5
```
