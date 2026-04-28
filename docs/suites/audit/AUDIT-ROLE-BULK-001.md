## AUDIT-ROLE-BULK-001 — Bulk role assignment is logged per user

```yaml
id: AUDIT-ROLE-BULK-001
title: Bulk-assigning a role to multiple users logs one entry per user
goal: |
  Verify that when an IT Admin bulk-assigns a role to multiple users
  in one action, the system-wide audit log (audit_log_entries) records
  one entry per affected user with actor, timestamp, target user, prior
  role, and new role — not a single aggregated entry.
roles:
  - IT Admin
capabilities:
  - CAP-IDEN-ROLES
  - CAP-IDEN-AUDIT-SYSTEM-LOG
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least three non-admin users with different current roles exist.
steps:
  - n: 1
    action: |
      As IT Admin, select three users in the user list. Bulk-assign a
      single new role to all three. Save.
    expected: |
      All three users update.
  - n: 2
    action: |
      Open the system-wide audit log (audit_log_entries) filtered to
      user-management events.
    expected: |
      Three separate entries are present, one per user. Each shows
      actor, timestamp, target user, prior role, and new role. The
      bulk operation is identifiable (e.g., shared correlation ID or
      "bulk" indicator) but each user has its own entry.
expected_overall: |
  Bulk operations produce one auditable entry per affected record in
  the system-wide audit log.
pass_criteria: |
  Three distinct entries present in the system-wide audit log
  (audit_log_entries) AND each captures prior and new role AND bulk
  action is identifiable.
why_this_matters: |
  Aggregated bulk-action logs hide which user got what permission.
  Per-user entries are the only way to reconstruct who had what at any
  point in time.
est_minutes: 5
```
