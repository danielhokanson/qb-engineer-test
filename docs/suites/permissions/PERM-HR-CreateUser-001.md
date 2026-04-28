## PERM-HR-CreateUser-001 — HR cannot create a system user

```yaml
id: PERM-HR-CreateUser-001
title: HR is denied creating a system user
goal: |
  Verify an HR user cannot create *system* users. HR creates
  *employee records*; converting an employee record into a system
  account belongs to IT Admin.
roles:
  - HR
capabilities:
  - CAP-IDEN-USERS
preconditions:
  - An HR user exists with no other roles attached.
steps:
  - n: 1
    action: |
      Sign in as HR. Open the employee record area, then look for any
      "create system user" surface.
    expected: |
      HR can manage employee records but the system-user creation
      action is not available.
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
  HR cannot create system users.
pass_criteria: |
  No user created AND endpoint rejected.
notes: |
  Employee record vs. system-user account is a key distinction.
  Conflating them is a common over-permission failure when HR is
  given "user management" because of the word overlap.
est_minutes: 4
```
