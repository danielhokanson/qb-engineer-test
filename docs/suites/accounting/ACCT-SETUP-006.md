## ACCT-SETUP-006 — Lock currency to a single home currency

```yaml
id: ACCT-SETUP-006
title: Restrict the shop to a single home currency
goal: |
  Verify that the built-in accounting module operates in a single
  home currency only, that the home currency is set at first-time
  setup, and that no transaction or report exposes a multi-currency
  surface that could confuse the user.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Administrator
preconditions:
  - The chart of accounts has been initialized (ACCT-SETUP-001).
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Open the accounting setup area and find the currency setting.
    expected: |
      A single home currency is shown (default USD or the locale
      default). It is editable at setup time.
  - n: 2
    action: |
      Confirm the home currency.
    expected: |
      The currency is locked. A message indicates that the built-in
      accounting module supports one currency per shop.
  - n: 3
    action: |
      Open a new customer invoice and a new vendor bill.
    expected: |
      Neither offers a currency selector. Amounts are entered and
      shown only in the home currency.
expected_overall: |
  Home currency is set once and consistently applied; no multi-currency
  surface appears anywhere in the built-in accounting flows.
pass_criteria: |
  Home currency locked AND no currency picker visible on any invoice,
  bill, payment, or report.
why_this_matters: |
  This module is for shops too small to handle FX. Surfacing a currency
  picker invites bugs without giving the user any benefit.
est_minutes: 4
```
