## AUDIT-PERMS-CHG-001 — Role permission changes are logged

```yaml
id: AUDIT-PERMS-CHG-001
title: Changing the permissions on a role is logged with diff
goal: |
  Verify that adding or removing a permission from a role records
  the change in the system-wide audit log (audit_log_entries) with
  actor, timestamp, role, and a diff of permissions.
roles:
  - Administrator
  - IT Admin
capabilities:
  - CAP-IDEN-ROLES
  - CAP-IDEN-AUDIT-SYSTEM-LOG
preconditions:
  - At least one custom role exists (P0-USER-001).
steps:
  - n: 1
    action: |
      Open the role. Add a new permission. Save.
    expected: |
      Change saves.
  - n: 2
    action: |
      Remove a different permission. Save.
    expected: |
      Change saves.
  - n: 3
    action: |
      Open the system-wide audit log (audit_log_entries) filtered to
      role / permission events.
    expected: |
      Two entries present, each showing: actor, timestamp, role, and
      what was added or removed.
expected_overall: |
  Role-permission changes are fully audited in the system-wide audit
  log.
pass_criteria: |
  Both entries present in the system-wide audit log (audit_log_entries)
  with full diffs.
why_this_matters: |
  Permission creep — quietly adding capabilities to roles over time
  — is how access control degrades. Without a clear log, no one
  notices until a security review.
est_minutes: 4
```
