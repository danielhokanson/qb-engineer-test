## RPT-TRIALBAL-003 — Trial balance by dimension stays in balance per slice

```yaml
id: RPT-TRIALBAL-003
title: Per-dimension trial balance stays in balance for each dimension value
goal: |
  Run the trial balance filtered to one dimension value (e.g.,
  department, location, or class). Verify it still has debits =
  credits — i.e., postings tagged to a single dimension are also
  internally balanced.
roles:
  - Controller
preconditions:
  - Postings carry a department / location / class dimension and at
    least two values exist with their own activity.
prerequisite_cases:
  - P5-CLOSE-004
  - P1-GL-001
steps:
  - n: 1
    action: |
      Run the trial balance filtered to dimension value A.
    expected: |
      Report renders. Total debits = total credits for that slice.
  - n: 2
    action: |
      Run the trial balance filtered to dimension value B.
    expected: |
      Same — debits = credits for that slice.
  - n: 3
    action: |
      Run the unfiltered trial balance. Sum (A trial balance debits +
      B debits + any other slices). Compare to unfiltered debits.
    expected: |
      Match within $0.01.
expected_overall: |
  Per-dimension trial balance is balanced for every slice and the
  per-slice sum equals the consolidated.
pass_criteria: |
  Every per-dimension slice has debits = credits AND the per-slice
  sum equals the consolidated within $0.01.
why_this_matters: |
  A common bug: a one-sided posting tagged to a dimension. The
  consolidated trial balance still balances (offset elsewhere) but
  the per-dimension view exposes the error.
est_minutes: 10
```
