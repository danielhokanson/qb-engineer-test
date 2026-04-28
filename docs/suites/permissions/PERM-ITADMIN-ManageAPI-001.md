## PERM-ITADMIN-ManageAPI-001 — IT Admin can manage API keys / integrations

```yaml
id: PERM-ITADMIN-ManageAPI-001
title: IT Admin is allowed to manage API keys and integrations
goal: |
  Verify an IT Admin can create, rotate, or revoke API keys for
  integrations, and that the action is captured with attribution
  and key metadata (NOT the secret) in the audit log.
roles:
  - IT Admin
capabilities:
  - CAP-IDEN-AUTH-API-KEYS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An IT Admin user exists.
  - The integrations / API key area is enabled in tenant config.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Open the API keys / integrations area.
      Create a new API key with a label and a scoped permission set.
    expected: |
      A new key is generated and shown once. The label and scope are
      recorded.
  - n: 2
    action: |
      Open the integrations audit log.
    expected: |
      Key creation is attributed to the IT Admin with timestamp,
      label, scope, and a key fingerprint / id (NOT the secret).
expected_overall: |
  IT Admin manages API keys; action is fully auditable.
pass_criteria: |
  Key created AND audit log captures actor, timestamp, label, scope,
  and key id. The secret value is NOT logged.
notes: |
  The audit log must never store the API secret in plain text. If
  the log shows the full secret, that itself is a finding.
est_minutes: 6
```
