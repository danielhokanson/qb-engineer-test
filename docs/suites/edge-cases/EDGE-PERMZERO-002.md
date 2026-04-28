## EDGE-PERMZERO-002 — A spending limit of exactly zero blocks all expense submission

```yaml
id: EDGE-PERMZERO-002
title: A user with a spending limit of zero cannot submit any expense, including zero-dollar
goal: |
  Verify that a user configured with a spending limit of $0 — for
  example, a contractor not yet authorized to incur expenses — cannot
  submit expense reports of any amount, and that the UI explains the
  limit clearly.
roles:
  - Administrator
  - HR
capabilities:
  - CAP-IDEN-ROLES
  - CAP-CROSS-PERMS-MATRIX
  - CAP-ACCT-EXPENSES
preconditions:
  - A user with spending limit explicitly = 0.
  - An expense-submission workflow exists.
steps:
  - n: 1
    action: |
      As the zero-limit user, start an expense report and add a $1
      expense line.
    expected: |
      Submission is blocked with a clear "spending limit is $0; you
      cannot submit expenses" message.
  - n: 2
    action: |
      Reduce the line to $0 and try again.
    expected: |
      Still blocked. Zero is not a back door.
  - n: 3
    action: |
      Have an administrator raise the limit to $1. Re-attempt the $1
      submission.
    expected: |
      Submission succeeds. The change to the limit is auditable.
  - n: 4
    action: |
      Have the administrator drop the limit back to $0. Confirm any
      future submission is again blocked.
    expected: |
      Block is reinstated.
expected_overall: |
  Zero spending limit blocks all submission and is reversible without
  collateral damage.
pass_criteria: |
  No submission possible at zero limit AND limit changes are
  auditable AND boundary toggling works cleanly.
why_this_matters: |
  Zero is often the default state for new users. The system has to
  treat it as "no authority" to be safe by default — not as a bypass.
est_minutes: 8
```
