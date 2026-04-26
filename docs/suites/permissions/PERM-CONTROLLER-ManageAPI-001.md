## PERM-CONTROLLER-ManageAPI-001 — Controller cannot manage API keys

```yaml
id: PERM-CONTROLLER-ManageAPI-001
title: Controller is denied managing API keys / integrations
goal: |
  Verify a Controller cannot create or rotate API keys. Integration
  credential management belongs to IT Admin / Administrator; a
  Controller who can also mint API keys can grant external services
  arbitrary financial authority.
roles:
  - Controller
preconditions:
  - A Controller user exists with no other roles attached.
  - The integrations area exists and has at least one configured
    integration.
steps:
  - n: 1
    action: |
      Sign in as Controller. Look for any API keys / integrations
      area.
    expected: |
      The integrations admin area is not visible or not enabled.
  - n: 2
    action: |
      Attempt a create-API-key endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Controller cannot manage API keys.
pass_criteria: |
  No new key created AND no existing keys rotated AND endpoint
  rejected.
est_minutes: 4
```
