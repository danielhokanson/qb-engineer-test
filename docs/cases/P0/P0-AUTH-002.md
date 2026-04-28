## P0-AUTH-002 — Self-service password reset works end-to-end

```yaml
id: P0-AUTH-002
title: A user can reset their own password via email and sign back in
goal: |
  Verify the password-reset flow: user requests a reset, receives a
  one-time link, sets a new password, and signs in with it. The old
  password no longer works.
roles:
  - Administrator
  - IT Admin
flows:
  - tenant-onboarding
capabilities:
  - CAP-IDEN-AUTH-PASSWORD
preconditions:
  - At least two users exist with valid email addresses.
prerequisite_cases:
  - P0-USER-003
steps:
  - n: 1
    action: |
      At the sign-in page, choose "Forgot password" (or equivalent).
      Enter the email of the second user (Sam Rivera).
    expected: |
      The application confirms a reset link will be sent. The
      message does NOT confirm or deny whether the email exists in
      the system (account-enumeration protection).
  - n: 2
    action: |
      Open the user's mailbox. Open the reset email. Click the link.
    expected: |
      Reset form opens. The link should be limited-use and time-
      bounded (typically 1 hour).
  - n: 3
    action: |
      Enter a new strong password. Confirm.
    expected: |
      Password is updated. A confirmation email is sent to the user.
  - n: 4
    action: |
      Try to sign in with the OLD password.
    expected: |
      Sign-in is rejected.
  - n: 5
    action: |
      Sign in with the NEW password.
    expected: |
      Sign-in succeeds.
  - n: 6
    action: |
      Click the same reset link a second time.
    expected: |
      Link is rejected as already used (or expired). Reset form does
      not open.
expected_overall: |
  Password reset works end-to-end with single-use, time-bounded link.
pass_criteria: |
  New password works AND old password rejected AND reset link is
  one-time-use.
why_this_matters: |
  Password reset via plain email is the most-attacked flow. Failure
  modes — non-bounded links, multi-use tokens, account enumeration —
  are all real-world security incidents.
est_minutes: 8
negative_variants:
  - id: P0-AUTH-002-N1
    title: Reset link expires after the documented window
    action: |
      Request a reset, then wait beyond the documented link expiry
      (or backdate as needed). Then click the link.
    expected: |
      Link is rejected as expired. A new reset can be requested.
    pass_criteria: |
      Expired link blocks reset AND a fresh request still works.
  - id: P0-AUTH-002-N2
    title: Reset request for unknown email does not leak existence
    action: |
      Request a password reset for "no-such-user@example.com".
    expected: |
      The confirmation message is identical to the message for a
      known email — no "user not found" hint, no error.
    pass_criteria: |
      Response is indistinguishable from the known-email response.
  - id: P0-AUTH-002-N3
    title: Reset link from one user cannot be used for another
    action: |
      Request a reset for Sam Rivera. Take the token, attempt to use
      it to reset Alex Morgan's password.
    expected: |
      The token is rejected for any account other than the one it was
      issued for.
    pass_criteria: |
      Cross-account use of a reset token is refused.
```
