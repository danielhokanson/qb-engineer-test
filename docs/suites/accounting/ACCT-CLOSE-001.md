## ACCT-CLOSE-001 — Closing a month locks new postings to that month

```yaml
id: ACCT-CLOSE-001
title: Closing a month prevents new postings dated in that month
goal: |
  Verify that when the shop owner closes a calendar month, the
  application records the closure and from that point on rejects
  any attempt to post a new transaction (invoice, bill, payment,
  manual adjustment) with a date in that closed month.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
preconditions:
  - Activity has been posted in the prior month and reconciled.
prerequisite_cases:
  - ACCT-RPT-001
steps:
  - n: 1
    action: |
      Open the period-close screen and choose to close the prior
      month.
    expected: |
      The screen lists outstanding tasks (un-reconciled bank
      activity, unposted drafts) for review. After confirmation, the
      month is closed. A close timestamp and actor are recorded.
  - n: 2
    action: |
      Re-open the period list.
    expected: |
      The closed month is flagged "closed".
expected_overall: |
  Closing a month is auditable and visible, with no postings allowed
  after close.
pass_criteria: |
  Month flagged closed AND close actor and timestamp recorded.
est_minutes: 5
```
