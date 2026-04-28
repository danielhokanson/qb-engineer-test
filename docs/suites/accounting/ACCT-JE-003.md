## ACCT-JE-003 — Correcting entry into a prior open period

```yaml
id: ACCT-JE-003
title: A correction dated in a prior open period posts to that period, not the current one
goal: |
  Verify that when the user records a manual correction with a
  posting date in a prior period that is still open (not yet
  closed), the correction lands in that prior period — affecting
  the prior month's reports — rather than being silently rolled
  forward to the current period.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-ACCT-PERIOD
preconditions:
  - The current period is open.
  - The immediately prior period is also still open (not yet closed).
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note the prior period's P&L total (e.g., total expenses for
      that period) and the current period's running expense total.
    expected: |
      Both visible. Record them.
  - n: 2
    action: |
      Record a balanced manual correction of $25.00 (added to a
      chosen expense category, subtracted from cash) dated within
      the prior open period.
    expected: |
      The application accepts the prior-period date because that
      period is still open. The user is warned in plain language
      that they are posting to a prior period.
  - n: 3
    action: |
      Re-check both periods' P&Ls.
    expected: |
      The prior period's expense total increased by $25.00. The
      current period's expense total is unchanged.
expected_overall: |
  Posting date governs which period is affected; prior-open-period
  postings are accepted with a warning.
pass_criteria: |
  Correction posted to the prior period AND prior-period P&L moved
  AND current-period P&L unchanged AND user was warned.
est_minutes: 7
```
