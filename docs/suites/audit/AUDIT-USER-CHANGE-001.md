## AUDIT-USER-CHANGE-001 — User role changes capture before / after

```yaml
id: AUDIT-USER-CHANGE-001
title: Changing a user's role is logged with before and after state
goal: |
  Verify that when an IT Admin changes a user's role, the system-wide
  audit log (audit_log_entries) shows actor, target user, prior role,
  new role, and timestamp.
roles:
  - IT Admin
preconditions:
  - An IT Admin user exists.
  - At least one non-admin user exists.
steps:
  - n: 1
    action: |
      As IT Admin, open a non-admin user. Note their current role.
      Change their role to a different role. Save.
    expected: |
      Change saves.
  - n: 2
    action: |
      Open the system-wide audit log (audit_log_entries) filtered to
      user-management events.
    expected: |
      A role-change entry is present with actor (IT Admin), target
      user, prior role, new role, and timestamp.
  - n: 3
    action: |
      Revert the change.
    expected: |
      Second entry recorded for the revert, also with full before /
      after.
expected_overall: |
  User-role changes record full before/after with attribution in the
  system-wide audit log.
pass_criteria: |
  Both entries present in the system-wide audit log (audit_log_entries)
  AND each captures actor, target, prior, new, timestamp.
est_minutes: 5
```
