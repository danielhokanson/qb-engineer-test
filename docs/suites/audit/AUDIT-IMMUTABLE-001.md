## AUDIT-IMMUTABLE-001 — Audit log entries cannot be modified or deleted

```yaml
id: AUDIT-IMMUTABLE-001
title: Audit entries are immutable; no role can edit or delete them
goal: |
  Verify the system-wide audit log (audit_log_entries) is append-only
  — no role, including Administrator, can edit an existing entry,
  delete an entry, or alter timestamps.
roles:
  - Administrator
capabilities:
  - CAP-IDEN-AUDIT-SYSTEM-LOG
preconditions:
  - At least 10 system-wide audit log (audit_log_entries) entries exist
    from prior cases.
steps:
  - n: 1
    action: |
      As Administrator, open the system-wide audit log
      (audit_log_entries). Look for any edit, delete, or modify action
      on an individual entry.
    expected: |
      No such action exists in the UI.
  - n: 2
    action: |
      If the application has an API, attempt to PATCH or DELETE a
      system-wide audit log entry (audit_log_entries).
    expected: |
      The request is rejected. The entry is unchanged.
  - n: 3
    action: |
      Reload the system-wide audit log (audit_log_entries).
    expected: |
      Every entry from before the test is still present unchanged.
expected_overall: |
  System-wide audit log (audit_log_entries) is genuinely immutable.
pass_criteria: |
  No edit / delete possible from UI AND API rejects modification on
  audit_log_entries AND count of entries is unchanged.
why_this_matters: |
  Editable audit logs are not audit logs. The entire point is that
  what was recorded cannot be quietly altered after the fact.
est_minutes: 5
```
