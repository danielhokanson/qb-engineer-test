## AUDIT-LOGIN-001 — Sign-in and sign-out events are logged

```yaml
id: AUDIT-LOGIN-001
title: Successful and failed sign-in events are recorded with source detail
goal: |
  Verify that sign-in successes, sign-in failures, and sign-outs are
  all recorded with user, timestamp, IP / source, and outcome.
roles:
  - IT Admin
preconditions:
  - At least two users exist.
  - The audit log is reachable for the IT Admin.
steps:
  - n: 1
    action: |
      As IT Admin, sign out. Sign back in successfully.
    expected: |
      Sign-in succeeds.
  - n: 2
    action: |
      Sign out, then attempt to sign in with a deliberately wrong
      password. Then sign in correctly.
    expected: |
      Failed attempt, then successful sign-in.
  - n: 3
    action: |
      Open the audit log filtered to authentication events.
    expected: |
      Three entries are visible: a sign-out, a failed sign-in attempt,
      a successful sign-in. Each has user (or attempted user),
      timestamp, source IP / device, and outcome.
expected_overall: |
  Authentication events are fully recorded.
pass_criteria: |
  All three events present in the audit log AND failure is
  distinguishable from success AND source detail is captured.
est_minutes: 5
```
