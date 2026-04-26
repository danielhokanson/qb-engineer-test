## PERM-ADMIN-ManageAPI-001 — Administrator can manage API keys / integrations

```yaml
id: PERM-ADMIN-ManageAPI-001
title: Administrator is allowed to manage API keys and integrations
goal: |
  Verify the Administrator can manage integrations during setup
  (P0 binds shipping / accounting integrations), and that key actions
  are audited.
roles:
  - Administrator
preconditions:
  - The Administrator user exists.
  - The integrations / API key area is enabled.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Open the integrations area. Bind or
      reconfigure one integration's credentials.
    expected: |
      Change saves. The integration is connected (or marked
      reconnected).
  - n: 2
    action: |
      Open the integrations audit log.
    expected: |
      The action is attributed to the Administrator with timestamp,
      integration name, and a key fingerprint / id (NOT the secret).
expected_overall: |
  Administrator manages integrations; action is auditable.
pass_criteria: |
  Integration updated AND audit log captures actor, timestamp,
  integration, and key id. Secret is NOT logged.
est_minutes: 5
```
