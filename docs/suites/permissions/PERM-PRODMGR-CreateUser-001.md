## PERM-PRODMGR-CreateUser-001 — Production Manager cannot create a user

```yaml
id: PERM-PRODMGR-CreateUser-001
title: Production Manager is denied creating a system user
goal: |
  Verify a Production Manager cannot create system users.
roles:
  - Production Manager
capabilities:
  - CAP-IDEN-USERS
preconditions:
  - A Production Manager user exists with no other roles attached.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for any user-management area.
    expected: |
      User management is not visible or not enabled.
  - n: 2
    action: |
      Type the user-create URL directly.
    expected: |
      The form does not render.
  - n: 3
    action: |
      If an API is exposed, attempt the create-user call.
    expected: |
      The request is rejected.
expected_overall: |
  Production Manager cannot create users.
pass_criteria: |
  No user created AND endpoint rejected.
est_minutes: 3
```
