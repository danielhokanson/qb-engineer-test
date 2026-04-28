## P0-AUTH-004 — Issue and revoke an API token

```yaml
id: P0-AUTH-004
title: Issue an API token for an integration user and revoke it
goal: |
  Verify a service / integration account can be issued an API token,
  the token authenticates against the API, and revoking the token
  immediately blocks further calls.
roles:
  - IT Admin
  - Administrator
flows:
  - tenant-onboarding
capabilities:
  - CAP-IDEN-AUTH-API-KEYS
  - CAP-IDEN-AUDIT-SYSTEM-LOG
preconditions:
  - The application has at least one documented API endpoint for
    integration use.
  - A non-human / service user account exists or can be created.
steps:
  - n: 1
    action: |
      Create an integration account (e.g., "integration-quickbooks").
      In its settings, generate an API token.
    expected: |
      Token is generated and shown ONCE to the admin. The application
      makes clear the token cannot be retrieved later — it must be
      stored externally now. The token has a defined scope (e.g.,
      "read invoices") visible in settings.
  - n: 2
    action: |
      Use the token to call any documented read-only endpoint (or
      the application's "ping / whoami" endpoint).
    expected: |
      Call succeeds. The response shows the call was authenticated as
      the integration account.
  - n: 3
    action: |
      Revoke the token from the user's settings.
    expected: |
      Revoke succeeds. The token is removed from the list.
  - n: 4
    action: |
      Repeat the API call with the revoked token.
    expected: |
      Call is rejected with a clear authentication error.
  - n: 5
    action: |
      Open the system-wide audit log (audit_log_entries).
    expected: |
      Token issuance and revocation are both logged.
expected_overall: |
  API tokens authenticate, are scoped, and are revocable in real time;
  issuance and revocation are recorded in the system-wide audit log.
pass_criteria: |
  Token works while active AND fails immediately after revoke AND
  both events present in the system-wide audit log (audit_log_entries).
est_minutes: 10
notes: |
  If the application doesn't expose an API at all, this case can be
  marked Blocked with a note. But "no API" is itself a finding worth
  flagging — most ERP buyers expect at least a read-only integration
  surface.

  Reconciled in Phase 2 — explicitly references system-wide audit log
  per L4 polish.
negative_variants:
  - id: P0-AUTH-004-N1
    title: Token cannot exceed its declared scope
    action: |
      Use the read-only-scoped token to call a write endpoint.
    expected: |
      The call is rejected with a clear scope-violation error. No
      record is created or modified.
    pass_criteria: |
      Out-of-scope call fails AND no side effect occurred.
  - id: P0-AUTH-004-N2
    title: Token is shown only once
    action: |
      After generating the token, navigate away. Return to the user's
      token list and try to view the generated token value.
    expected: |
      The full token is no longer retrievable; only metadata (label,
      scope, last-used) is shown.
    pass_criteria: |
      Token value is not retrievable after the initial display.
  - id: P0-AUTH-004-N3
    title: Tampered token is rejected
    action: |
      Modify a single character in a valid token and submit it.
    expected: |
      The call is rejected as unauthenticated. No partial
      authentication is granted.
    pass_criteria: |
      Tampered token is refused.
```
