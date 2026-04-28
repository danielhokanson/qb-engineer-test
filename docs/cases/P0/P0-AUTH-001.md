## P0-AUTH-001 — Enforce multi-factor authentication on the first admin

```yaml
id: P0-AUTH-001
title: Enroll the first admin in MFA and verify it's required on next sign-in
goal: |
  Configure multi-factor authentication on the first admin account
  (the canonical "high-privilege account that absolutely needs MFA")
  and verify subsequent sign-ins require the second factor.
roles:
  - Administrator
flows:
  - tenant-onboarding
capabilities:
  - CAP-IDEN-AUTH-MFA
  - CAP-IDEN-AUTH-PASSWORD
preconditions:
  - The first admin exists (P0-ADMIN-001).
  - The tenant has not yet enforced MFA on this account.
prerequisite_cases:
  - P0-ADMIN-001
steps:
  - n: 1
    action: |
      Sign in as the first admin. Find the security or account
      settings area. Locate the option to enable MFA.
    expected: |
      An MFA enrollment option is available. Supported factors are
      visible in plain language (authenticator app, SMS, hardware key).
  - n: 2
    action: |
      Enroll an authenticator-app factor by scanning the displayed
      QR code with any TOTP app. Enter the generated code to confirm.
    expected: |
      Enrollment completes. A confirmation appears. Backup recovery
      codes are presented (and the user is prompted to save them).
  - n: 3
    action: |
      Sign out completely. Sign back in with the password.
    expected: |
      A second-factor prompt appears before sign-in completes.
  - n: 4
    action: |
      Enter the current TOTP code. Confirm.
    expected: |
      Sign-in completes.
  - n: 5
    action: |
      Sign out again. Try to sign in with only the password (cancel
      the MFA prompt).
    expected: |
      Sign-in is blocked. No partial session is created.
expected_overall: |
  MFA is enrolled and enforced. Password-only sign-in is rejected.
pass_criteria: |
  MFA enrollment succeeded AND backup codes were provided AND
  password-only sign-in was blocked.
why_this_matters: |
  An ERP that doesn't support MFA on its highest-privilege accounts
  is unsafe for any company that takes security seriously. Catching
  this in P0 means it's set up correctly before there's anything
  worth attacking.
est_minutes: 8
negative_variants:
  - id: P0-AUTH-001-N1
    title: Reject incorrect MFA code
    action: |
      During sign-in, enter a wrong 6-digit code.
    expected: |
      Sign-in is rejected. A clear message says the code didn't match.
      No partial session is created. After several wrong attempts,
      either the user is rate-limited or the account is locked
      (per P0-AUTH-003).
    pass_criteria: |
      Wrong code rejected AND no session granted AND repeated wrong
      attempts trigger lockout / rate limit.
  - id: P0-AUTH-001-N2
    title: Reject expired TOTP code
    action: |
      Capture a valid TOTP code, wait 90 seconds for it to expire,
      then submit it.
    expected: |
      Sign-in is rejected with a message indicating the code is
      expired or invalid. No session is created.
    pass_criteria: |
      Expired code is rejected AND no session granted.
  - id: P0-AUTH-001-N3
    title: Backup code is single-use
    action: |
      Use one backup recovery code to sign in. Then attempt to use
      the same backup code again on a subsequent sign-in.
    expected: |
      The second use is rejected. The application makes clear the
      code was already consumed.
    pass_criteria: |
      Reused backup code is refused.
```
