## PERM-CONTROLLER-CreateUser-001 — Controller cannot create a user

```yaml
id: PERM-CONTROLLER-CreateUser-001
title: Controller is denied creating a system user
goal: |
  Verify a Controller cannot create system users. Identity
  administration belongs to IT Admin / Administrator; a Controller
  who can also provision users could grant themselves capabilities.
roles:
  - Controller
capabilities:
  - CAP-IDEN-USERS
preconditions:
  - A Controller user exists with no other roles attached.
steps:
  - n: 1
    action: |
      Sign in as Controller. Look for any user-management area.
    expected: |
      User management is not visible or not enabled.
  - n: 2
    action: |
      Type the user-create URL directly.
    expected: |
      The form does not render. Permission denial.
  - n: 3
    action: |
      If an API is exposed, attempt the create-user call.
    expected: |
      The request is rejected.
expected_overall: |
  Controller cannot create users.
pass_criteria: |
  No user created AND endpoint rejected.
why_this_matters: |
  A Controller who can also provision users can mint themselves
  whatever access they want, defeating the segregation of finance
  from identity.
est_minutes: 4
```
