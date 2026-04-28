## CONC-PERIOD-CLOSE-RACE-001 — Period close races a late posting

```yaml
id: CONC-PERIOD-CLOSE-RACE-001
title: A late posting racing the period close lands on the correct side
goal: |
  Verify that when a Controller initiates period close at the same
  moment another user is posting a transaction dated in that period,
  exactly one outcome occurs: either the transaction posts and is
  included in the closed period, or the close completes and the
  transaction is rejected as backdated. The transaction never
  silently lands in a closed period.
roles:
  - Controller
capabilities:
  - CAP-CROSS-CONCURRENCY
  - CAP-ACCT-PERIOD
preconditions:
  - A Controller user (User A) is in a position to close the period.
  - A second user (User B) has a draft transaction (e.g., a customer
    invoice or vendor invoice) ready to post, dated within the
    period being closed.
steps:
  - n: 1
    action: |
      User B: open the draft transaction in their session. Do not
      submit yet.
    expected: |
      Draft is editable.
  - n: 2
    action: |
      User A: initiate period close. Just before final confirmation,
      pause (e.g., review the close-summary screen).
    expected: |
      Close is staged but not yet committed.
  - n: 3
    action: |
      User B: submit / post their transaction.
    expected: |
      Outcome A — transaction posts before close commits: the
      transaction is included in the period. Close, when it commits,
      sees this transaction.
      Outcome B — close commits before the transaction posts: the
      transaction is rejected with a clear "period closed" message.
  - n: 4
    action: |
      User A: complete the close.
    expected: |
      Period is closed.
  - n: 5
    action: |
      Open reports for the closed period.
    expected: |
      If outcome A applied, the transaction appears in the period's
      reports. If outcome B applied, it does not. There is no third
      outcome.
expected_overall: |
  No transaction lands in a closed period silently.
pass_criteria: |
  Either outcome A or outcome B occurred AND there is no
  inconsistency between the report and the transaction status.
est_minutes: 10
```
