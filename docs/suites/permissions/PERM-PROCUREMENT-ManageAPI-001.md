## PERM-PROCUREMENT-ManageAPI-001 — Procurement cannot manage API keys

```yaml
id: PERM-PROCUREMENT-ManageAPI-001
title: Procurement is denied managing API keys / integrations
goal: |
  Verify a Procurement user cannot manage API keys, even those that
  feed vendor-portal / EDI integrations.
roles:
  - Procurement
capabilities:
  - CAP-IDEN-AUTH-API-KEYS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Procurement user exists with no other roles attached.
  - The integrations area exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Look for any API keys / integrations
      area.
    expected: |
      The integrations admin area is not visible.
  - n: 2
    action: |
      Attempt the create-API-key endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Procurement cannot manage API keys.
pass_criteria: |
  No new key created AND endpoint rejected.
est_minutes: 3
```
