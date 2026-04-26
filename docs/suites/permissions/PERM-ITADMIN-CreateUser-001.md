## PERM-ITADMIN-CreateUser-001 — IT Admin can create a user

```yaml
id: PERM-ITADMIN-CreateUser-001
title: IT Admin is allowed to create a system user
goal: |
  Verify an IT Admin user can create a new system user, and that the
  creation is audited.
roles:
  - IT Admin
preconditions:
  - An IT Admin user exists.
  - At least one role exists to assign to a new user.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Open the user management area. Create a
      new user with a test email and a non-admin role.
    expected: |
      User is created. Invitation or temporary credential is generated.
  - n: 2
    action: |
      Open the audit log.
    expected: |
      User creation is attributed to the IT Admin with a timestamp
      and the role granted.
expected_overall: |
  IT Admin creates users; action is auditable.
pass_criteria: |
  User created AND audit captures actor, target, role granted, timestamp.
est_minutes: 5
```
