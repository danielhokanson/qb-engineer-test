## PERM-ADMIN-CreateUser-001 — Administrator can create a user

```yaml
id: PERM-ADMIN-CreateUser-001
title: Administrator is allowed to create a system user
goal: |
  Verify the Administrator (the founding tenant user) can create
  additional users in early-stage operation, and that the action is
  audited.
roles:
  - Administrator
capabilities:
  - CAP-IDEN-USERS
preconditions:
  - The Administrator user exists.
  - At least one role exists to assign to a new user.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Open the user management area. Create
      a new user with a test email and a non-admin role.
    expected: |
      User is created. Invitation or temporary credential is generated.
  - n: 2
    action: |
      Open the audit log.
    expected: |
      User creation is attributed to the Administrator with timestamp
      and the role granted.
expected_overall: |
  Administrator creates users; action is auditable.
pass_criteria: |
  User created AND audit captures actor, target, role granted,
  timestamp.
notes: |
  In larger orgs IT Admin owns user management; in smaller orgs the
  founding Administrator does. Both allow paths exist.
est_minutes: 5
```
