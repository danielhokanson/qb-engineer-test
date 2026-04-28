## RPT-TRIALBAL-001 — Trial balance balances by account

```yaml
id: RPT-TRIALBAL-001
title: Trial balance shows debits = credits across all accounts
goal: |
  Run a trial balance for the closed period and verify that total
  debits equal total credits, and that each account's balance is
  derivable from posted JEs.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
preconditions:
  - The period has been closed.
prerequisite_cases:
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Run the trial balance as of the close date.
    expected: |
      Report lists every account with debits and credits.
  - n: 2
    action: |
      Total debits across all accounts should equal total credits.
    expected: |
      Equal to the cent. If not, the books are out of balance — a
      severe defect.
  - n: 3
    action: |
      Pick one account (e.g., Cash). Sum the JE postings to that
      account in the period. Compare to the trial-balance net.
    expected: |
      Match.
  - n: 4
    action: |
      Pick one income-statement account (e.g., Sales Revenue). Verify
      the balance equals the sum of revenue postings in the period.
    expected: |
      Match.
expected_overall: |
  Trial balance is balanced and each account ties to its postings.
pass_criteria: |
  Debits = credits AND spot-checked accounts reconcile to JE
  postings.
est_minutes: 10
```
