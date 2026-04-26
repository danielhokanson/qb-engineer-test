## PERM-FLOOR-CreateUser-001 — Floor Operator cannot create a user

```yaml
id: PERM-FLOOR-CreateUser-001
title: Floor Operator is denied creating a system user
goal: |
  Verify a Floor Operator cannot create system users.
roles:
  - Floor Operator
preconditions:
  - A Floor Operator user exists with no other roles attached.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any user-management area.
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
  Floor Operator cannot create users.
pass_criteria: |
  No user created AND endpoint rejected.
est_minutes: 3
```
