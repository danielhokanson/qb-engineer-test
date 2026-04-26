## P0-AUTH-005 — Configure SSO for the tenant

```yaml
id: P0-AUTH-005
title: Configure single sign-on (SSO) for the tenant
goal: |
  Set up SAML / OIDC single sign-on against an external identity
  provider and verify a federated user can sign in without a
  separate local password.
roles:
  - Administrator
  - IT Admin
flows:
  - tenant-onboarding
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - An external IdP test tenant is available (Azure AD, Okta, Google
    Workspace, etc.) with a test user.
  - A user record exists in the application matching the IdP user's
    email.
steps:
  - n: 1
    action: |
      In tenant settings, find the SSO area. Choose the protocol
      (SAML or OIDC).
    expected: |
      Configuration form for the chosen protocol opens.
  - n: 2
    action: |
      Configure the SSO with the IdP's metadata (entity ID, ACS URL,
      certificate, claims mapping). Save.
    expected: |
      Configuration saves. The application provides a test-connection
      affordance.
  - n: 3
    action: |
      Test the connection. Then sign out completely.
    expected: |
      Test reports success.
  - n: 4
    action: |
      At the sign-in page, choose the SSO option. Authenticate at the
      IdP.
    expected: |
      After IdP authentication, the user is signed into the
      application as the matching user with the right role.
  - n: 5
    action: |
      Verify the audit log records the SSO sign-in with provider
      detail.
    expected: |
      Entry present with provider, user, and timestamp.
expected_overall: |
  SSO works end-to-end. Federated user signs in successfully.
pass_criteria: |
  SSO completes AND user lands in the right role AND the sign-in is
  audited.
est_minutes: 15
notes: |
  If no IdP is available, this case can be marked Blocked with a
  note. SSO is a common buyer requirement at mid-market scale.
negative_variants:
  - id: P0-AUTH-005-N1
    title: SAML response with invalid signature is rejected
    action: |
      Submit a SAML assertion whose signature does not match the
      configured certificate.
    expected: |
      The application rejects the assertion and surfaces a clear
      "signature invalid" error in the audit log. No session created.
    pass_criteria: |
      Invalid-signature assertion is refused AND audited.
  - id: P0-AUTH-005-N2
    title: Federated user with no local match cannot sign in
    action: |
      Authenticate at the IdP as a user whose email has no matching
      record in the application.
    expected: |
      Sign-in is rejected with a clear message that the user has no
      account in this tenant. No auto-provisioning unless explicitly
      configured.
    pass_criteria: |
      Unmatched federated user is denied AND the rejection is
      explained.
  - id: P0-AUTH-005-N3
    title: SSO config save with malformed metadata
    action: |
      Save the SSO configuration with a missing or malformed entity
      ID, ACS URL, or certificate.
    expected: |
      Save is blocked with field-by-field error messages naming each
      problem in plain English.
    pass_criteria: |
      Save blocked AND the broken fields are individually identified.
```
