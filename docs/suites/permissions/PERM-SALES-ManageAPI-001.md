## PERM-SALES-ManageAPI-001 — Sales cannot manage API keys

```yaml
id: PERM-SALES-ManageAPI-001
title: Sales / Account Manager is denied managing API keys / integrations
goal: |
  Verify a Sales user cannot manage API keys, even those that feed
  CRM / sales-side integrations. Credential issuance belongs to IT.
roles:
  - Sales / Account Manager
preconditions:
  - A Sales user exists with no other roles attached.
  - The integrations area exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look for any API keys / integrations area.
    expected: |
      The integrations admin area is not visible.
  - n: 2
    action: |
      Attempt the create-API-key endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Sales cannot manage API keys.
pass_criteria: |
  No new key created AND endpoint rejected.
est_minutes: 3
```
