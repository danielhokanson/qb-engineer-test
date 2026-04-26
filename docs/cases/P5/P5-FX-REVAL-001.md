## P5-FX-REVAL-001 — Multi-currency revaluation at period end

```yaml
id: P5-FX-REVAL-001
title: Run period-end FX revaluation on open foreign-currency balances
goal: |
  Verify the application revalues open foreign-currency AR and AP
  balances at the period-end rate, posting an unrealized gain or
  loss to the appropriate GL account.
roles:
  - Controller
flows:
  - period-close
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one open AR or AP balance in a foreign currency exists.
  - A period-end FX rate that differs from the original transaction
    rate is loaded.
prerequisite_cases:
  - P2-CUST-004
steps:
  - n: 1
    action: |
      Find the FX revaluation area. Run revaluation for the period
      end.
    expected: |
      Application identifies open foreign-currency balances and
      computes the revaluation per balance.
  - n: 2
    action: |
      Review the revaluation summary.
    expected: |
      For each balance: foreign amount, original USD value, revalued
      USD value, unrealized gain or loss.
  - n: 3
    action: |
      Post the revaluation.
    expected: |
      Adjusting JE posts to AR / AP control accounts and to
      Unrealized FX Gain / Loss (NOT Realized — that's reserved for
      settlement).
expected_overall: |
  FX revaluation posts unrealized gain / loss correctly.
pass_criteria: |
  Revaluation amount matches hand math AND unrealized account is
  used (not realized).
est_minutes: 10
```
