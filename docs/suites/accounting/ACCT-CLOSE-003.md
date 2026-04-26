## ACCT-CLOSE-003 — Admin re-opens a closed month, with audit trail

```yaml
id: ACCT-CLOSE-003
title: An admin re-opens a closed month and the action is recorded
goal: |
  Verify that a user with admin privileges can re-open a previously
  closed month, that the re-opening is recorded with actor,
  timestamp, and reason, and that postings dated in that month are
  again accepted until it is re-closed.
optional_module: builtin-accounting
roles:
  - Administrator
  - Shop Owner
preconditions:
  - At least one closed month exists.
prerequisite_cases:
  - ACCT-CLOSE-001
steps:
  - n: 1
    action: |
      Sign in as an admin. Open the period-close screen and choose
      "Re-open" on the closed month. Enter a reason in plain
      language (e.g., "Missed bill from supplier").
    expected: |
      The application accepts the re-open and records the actor,
      timestamp, and reason. The month is flagged re-opened (or
      simply open again, with re-open history visible).
  - n: 2
    action: |
      Try to record a vendor bill with a date in that month.
    expected: |
      The bill posts successfully (the month is now open).
  - n: 3
    action: |
      Open the period's audit / history view.
    expected: |
      Both the original close and the re-open are listed with their
      actors, timestamps, and (for the re-open) reason.
expected_overall: |
  Admin re-open is supported, gated to admin only, fully audited, and
  restores normal posting.
pass_criteria: |
  Re-open succeeded AND post into the period accepted AND audit shows
  both close and re-open with actor, timestamp, and reason.
why_this_matters: |
  Closing must be defensible (you closed the books) and re-openable
  (real corrections come in late). Without the audit trail, either
  side gets abused.
est_minutes: 7
```
