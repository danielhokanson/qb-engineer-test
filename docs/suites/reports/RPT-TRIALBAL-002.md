## RPT-TRIALBAL-002 — Adjusted vs. preliminary trial balance shows the closing entries

```yaml
id: RPT-TRIALBAL-002
title: Adjusted trial balance differs from preliminary only by closing entries
goal: |
  Run the preliminary (pre-close) trial balance and the adjusted
  (post-close) trial balance for the same period. The difference per
  account should equal the sum of closing/adjusting JEs posted to
  that account.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
  - CAP-ACCT-PERIOD
preconditions:
  - The period has both pre-close and post-close states
    available (closing JEs were posted as part of P5-CLOSE-004).
  - At least one closing/adjusting JE was posted.
prerequisite_cases:
  - P5-CLOSE-004
  - P5-JE-001
steps:
  - n: 1
    action: |
      Run the preliminary trial balance (pre-close, or "as posted").
    expected: |
      Report renders showing accounts before closing JEs.
  - n: 2
    action: |
      Run the adjusted (post-close) trial balance for the same
      period end date.
    expected: |
      Report renders. Account balances may differ for accounts
      affected by closing JEs.
  - n: 3
    action: |
      Pick one account that had a closing JE (e.g., revenue moving
      to retained earnings). Compute (preliminary - adjusted).
    expected: |
      Equals the sum of closing JE postings to that account within
      $0.01.
  - n: 4
    action: |
      Both versions still have debits = credits.
    expected: |
      Equal to the cent on both versions.
expected_overall: |
  Adjusted - preliminary equals the closing JE activity per account,
  and both versions remain in balance.
pass_criteria: |
  Spot-checked account difference equals closing JE sum within $0.01
  AND both trial balances remain debit = credit.
why_this_matters: |
  Misposted closing entries are easy to introduce and tedious to
  catch. Comparing pre/post views is the auditor's standard check.
est_minutes: 10
```
