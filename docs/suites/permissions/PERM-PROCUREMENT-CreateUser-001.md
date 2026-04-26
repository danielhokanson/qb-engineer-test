## PERM-PROCUREMENT-CreateUser-001 — Procurement cannot create a user

```yaml
id: PERM-PROCUREMENT-CreateUser-001
title: Procurement is denied creating a system user
goal: |
  Verify a Procurement user, who has no identity-administration
  authority, cannot create new users.
roles:
  - Procurement
preconditions:
  - A Procurement user exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Look for any user-management area.
    expected: |
      User management is not visible or not enabled.
  - n: 2
    action: |
      Try the user-create endpoint via direct URL or API.
    expected: |
      The action is rejected with a clear authorization error.
expected_overall: |
  Procurement cannot create users.
pass_criteria: |
  No user created AND endpoint rejected.
est_minutes: 4
```
