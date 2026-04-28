## PERM-SALES-CreateUser-001 — Sales cannot create a user

```yaml
id: PERM-SALES-CreateUser-001
title: Sales / Account Manager is denied creating a system user
goal: |
  Verify a Sales user cannot create system users.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-IDEN-USERS
preconditions:
  - A Sales user exists with no other roles attached.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look for any user-management area.
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
  Sales cannot create users.
pass_criteria: |
  No user created AND endpoint rejected.
est_minutes: 3
```
