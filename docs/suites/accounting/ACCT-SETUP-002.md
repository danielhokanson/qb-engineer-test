## ACCT-SETUP-002 — Set the fiscal year start

```yaml
id: ACCT-SETUP-002
title: Configure when the shop's fiscal year begins
goal: |
  Verify that the shop owner can set the fiscal year start month,
  and that monthly and yearly reports honor that choice.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Administrator
capabilities:
  - CAP-IDEN-TENANT-CONFIG
preconditions:
  - The chart of accounts has been initialized (ACCT-SETUP-001).
  - No periods have been closed yet.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Open the accounting settings area and find the fiscal year
      start setting.
    expected: |
      Fiscal year start is configurable as a calendar month. The
      current value (default January) is shown.
  - n: 2
    action: |
      Change fiscal year start to July and save.
    expected: |
      The change is accepted and confirmed.
  - n: 3
    action: |
      Open the period list or the year-end close screen.
    expected: |
      The current fiscal year is shown as running July through June.
      Period names reflect the new fiscal calendar.
expected_overall: |
  Fiscal year start is configurable; downstream reports and period
  labels respect it.
pass_criteria: |
  Fiscal year start changed to July AND period boundaries shift
  accordingly across the application.
why_this_matters: |
  Many small shops do not run on a calendar year. Hard-coding January
  forces them to keep parallel books — defeating the point of a
  built-in accounting module.
est_minutes: 4
```
