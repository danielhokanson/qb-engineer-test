## PERM-PRODMGR-ManageAPI-001 — Production Manager cannot manage API keys

```yaml
id: PERM-PRODMGR-ManageAPI-001
title: Production Manager is denied managing API keys / integrations
goal: |
  Verify a Production Manager cannot manage API keys.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
  - The integrations area exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for any API keys /
      integrations area.
    expected: |
      The integrations admin area is not visible.
  - n: 2
    action: |
      Attempt the create-API-key endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Production Manager cannot manage API keys.
pass_criteria: |
  No new key created AND endpoint rejected.
est_minutes: 3
```
