## P0-AUTH-003 — Account lockout after repeated failed sign-in attempts

```yaml
id: P0-AUTH-003
title: Repeated failed sign-in attempts lock the account
goal: |
  Verify that a documented number of consecutive failed sign-in
  attempts on a single account triggers a lockout — and that the
  lockout is communicated, audit-logged, and recoverable.
roles:
  - IT Admin
flows:
  - tenant-onboarding
preconditions:
  - At least one user account exists.
  - The lockout policy (threshold, duration) is documented in the
    application's settings.
prerequisite_cases:
  - P0-USER-003
steps:
  - n: 1
    action: |
      Read the lockout policy in settings. Note the threshold (e.g.,
      5 failed attempts).
    expected: |
      Policy is visible and configurable. Defaults are sane (not
      "999 attempts before lockout").
  - n: 2
    action: |
      Try to sign in as Sam Rivera with the wrong password the
      threshold number of times.
    expected: |
      Each attempt is rejected. After the Nth failure, the account
      is locked.
  - n: 3
    action: |
      Try to sign in as Sam Rivera with the CORRECT password.
    expected: |
      Sign-in is still rejected with a clear "account locked" message
      (NOT "wrong password" — that would let an attacker enumerate
      lockouts).
  - n: 4
    action: |
      As the IT Admin, open the audit log.
    expected: |
      Lockout event is recorded with user, timestamp, and source IP.
  - n: 5
    action: |
      As the IT Admin, unlock the account from the user-management
      area (or wait for the lockout duration to elapse and re-test).
    expected: |
      The unlock action is recorded. After unlock, a correct password
      sign-in succeeds.
expected_overall: |
  Lockout triggers, holds, audits, and is recoverable.
pass_criteria: |
  Threshold is enforced AND locked-account sign-in is rejected with
  the right message AND unlock works AND both lock and unlock are
  audited.
est_minutes: 8
negative_variants:
  - id: P0-AUTH-003-N1
    title: Lockout policy threshold cannot be set to 0 or absurdly high
    action: |
      Try to set the lockout threshold to 0 attempts, then to 9999
      attempts.
    expected: |
      Both extremes are blocked or warn. The application enforces a
      sensible minimum and maximum.
    pass_criteria: |
      Threshold is constrained to a defensible range with clear
      messaging at the bounds.
  - id: P0-AUTH-003-N2
    title: Lockout does not affect other accounts
    action: |
      After Sam Rivera is locked out, try to sign in as Alex Morgan
      with the correct password.
    expected: |
      Alex Morgan can sign in normally. Lockout is per-account, not
      tenant-wide.
    pass_criteria: |
      Other accounts remain accessible while one is locked.
  - id: P0-AUTH-003-N3
    title: Failed-sign-in attempts from many IPs still trigger lockout
    action: |
      Have failed attempts come from two different source IPs (or
      simulate via different sessions). Verify the count rolls up to
      the account, not per-IP.
    expected: |
      The threshold counts attempts against the user account
      regardless of source IP, preventing distributed brute-force.
    pass_criteria: |
      Account locks after the threshold is reached across sources.
```
