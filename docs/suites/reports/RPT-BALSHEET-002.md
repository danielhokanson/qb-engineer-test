## RPT-BALSHEET-002 — Comparative balance sheet (this period vs. prior) ties out

```yaml
id: RPT-BALSHEET-002
title: Comparative balance sheet reconciles each period column to its trial balance
goal: |
  Run the balance sheet in comparative mode (current close date vs.
  prior close date). Verify each column balances and ties to its
  respective trial balance.
roles:
  - Controller
preconditions:
  - Two sequential periods have been closed (P5-CLOSE-004 run twice).
  - Trial balance is runnable for both close dates.
prerequisite_cases:
  - P5-CLOSE-004
  - RPT-TRIALBAL-001
steps:
  - n: 1
    action: |
      Run the comparative balance sheet showing current period close
      date and prior period close date.
    expected: |
      Report renders. Both columns show assets, liabilities, equity,
      with a totals row and (typically) a variance column.
  - n: 2
    action: |
      For the current column: total assets equal total liabilities +
      equity.
    expected: |
      Equal to the cent.
  - n: 3
    action: |
      For the prior column: total assets equal total liabilities +
      equity.
    expected: |
      Equal to the cent.
  - n: 4
    action: |
      Run the trial balance as of the current close date. Each
      account on the balance sheet ties to the trial balance net.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Run the trial balance as of the prior close date. Each account
      on the prior column ties to that trial balance net.
    expected: |
      Match within $0.01.
expected_overall: |
  Both columns balance and reconcile to the trial balance for their
  respective close dates.
pass_criteria: |
  Both columns balance to the cent AND both columns reconcile to
  their trial balances within $0.01.
est_minutes: 12
```
