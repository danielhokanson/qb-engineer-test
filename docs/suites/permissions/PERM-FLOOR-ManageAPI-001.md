## PERM-FLOOR-ManageAPI-001 — Floor Operator cannot manage API keys

```yaml
id: PERM-FLOOR-ManageAPI-001
title: Floor Operator is denied managing API keys / integrations
goal: |
  Verify a Floor Operator cannot manage API keys.
roles:
  - Floor Operator
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - The integrations area exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any API keys / integrations
      area.
    expected: |
      The integrations admin area is not visible.
  - n: 2
    action: |
      Attempt the create-API-key endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Floor Operator cannot manage API keys.
pass_criteria: |
  No new key created AND endpoint rejected.
est_minutes: 3
```
