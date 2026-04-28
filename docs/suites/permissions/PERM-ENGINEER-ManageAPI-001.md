## PERM-ENGINEER-ManageAPI-001 — Engineer cannot manage API keys

```yaml
id: PERM-ENGINEER-ManageAPI-001
title: Engineer / R&D is denied managing API keys / integrations
goal: |
  Verify an Engineer / R&D user cannot manage API keys, even for
  PLM / CAD-system integrations they may use.
roles:
  - Engineer / R&D
capabilities:
  - CAP-IDEN-AUTH-API-KEYS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An Engineer user exists with no other roles attached.
  - The integrations area exists.
steps:
  - n: 1
    action: |
      Sign in as Engineer. Look for any API keys / integrations area.
    expected: |
      The integrations admin area is not visible.
  - n: 2
    action: |
      Attempt the create-API-key endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Engineer cannot manage API keys.
pass_criteria: |
  No new key created AND endpoint rejected.
est_minutes: 3
```
