## RPT-ARAGE-003 — AR aging filtered by sales rep / collector

```yaml
id: RPT-ARAGE-003
title: AR aging filtered by sales rep ties to that rep's customer balances
goal: |
  Run the AR aging filtered to one sales rep / collector. Verify the
  total equals the sum of open invoices for customers assigned to
  that rep, and per-rep totals roll up to the consolidated AR.
roles:
  - Sales / Account Manager
  - Controller
preconditions:
  - Customers with open invoices are assigned to at least two
    distinct sales reps.
prerequisite_cases:
  - P4-INV-001
  - RPT-ARAGE-001
steps:
  - n: 1
    action: |
      Run AR aging filtered to rep A.
    expected: |
      Report shows only rep A's customers with open balances.
  - n: 2
    action: |
      For one rep-A customer, sum their open invoices. Compare to
      their row total.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Run filtered to rep B. Sum all per-rep totals (A + B + ...
      unassigned). Compare to the unfiltered AR aging grand total.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Confirm a rep-B customer does NOT appear in rep A's filter.
    expected: |
      Excluded.
expected_overall: |
  Rep filter scopes correctly and per-rep sum equals consolidated.
pass_criteria: |
  Per-rep total reconciles within $0.01 AND per-rep sum equals
  consolidated within $0.01.
est_minutes: 8
```
