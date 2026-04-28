## EDGE-DATE-FYBOUNDARY-004 — Backdated transaction into a closed fiscal year is blocked

```yaml
id: EDGE-DATE-FYBOUNDARY-004
title: A backdated transaction into a closed prior fiscal year is rejected with a clear reason
goal: |
  Verify that once a fiscal year is closed, the application refuses to
  post a transaction dated within that closed year — and that the
  refusal explains why and points to the period-reopen path for
  authorized users.
roles:
  - Controller
  - AP Clerk
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-CROSS-PERMS-MATRIX
  - CAP-IDEN-AUDIT-SYSTEM-LOG
preconditions:
  - At least one prior fiscal year is closed (period-locked).
  - An AP Clerk user without reopen permission exists.
steps:
  - n: 1
    action: |
      As an AP Clerk, attempt to post a vendor invoice dated within the
      closed prior fiscal year.
    expected: |
      Post is blocked with a clear message identifying the closed period
      as the reason.
  - n: 2
    action: |
      Confirm the message does NOT silently re-date the transaction to
      the current open period.
    expected: |
      No silent date rewrite. The user keeps control of the date.
  - n: 3
    action: |
      As the Controller (with reopen permission), reopen the prior
      period long enough to post a legitimate adjustment, then reclose.
    expected: |
      Reopen succeeds; the adjustment posts; reclose succeeds; both the
      reopen and the adjustment are in the audit log.
expected_overall: |
  Closed prior years are protected. Reopening is auditable and gated
  by permission.
pass_criteria: |
  Backdated post is blocked for unauthorized user AND not silently
  redated AND reopen path is auditable.
why_this_matters: |
  An ERP that lets anyone post into a closed year invalidates every
  prior-year report and every audit signoff. The lock has to be real.
est_minutes: 8
```
