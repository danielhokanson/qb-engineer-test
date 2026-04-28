## P0-AUDIT-001 — Admin actions log is reachable and reflects setup activity

```yaml
id: P0-AUDIT-001
title: The system-wide audit log captures setup activity from Phase 0
goal: |
  Verify that the system-wide audit log (audit_log_entries) is
  reachable and shows the consequential admin actions performed
  during Phase 0 (tenant settings, role creation, user invitation,
  integration choices).
roles:
  - Administrator
  - IT Admin
flows:
  - tenant-onboarding
capabilities:
  - CAP-IDEN-AUDIT-SYSTEM-LOG
preconditions:
  - Phase 0 cases through P0-USER-003 have been run.
prerequisite_cases:
  - P0-USER-003
steps:
  - n: 1
    action: |
      Find and open the system-wide audit log (audit_log_entries) area.
    expected: |
      System-wide audit log opens. Filtering by date and event type is
      available.
  - n: 2
    action: |
      Filter to the period covering this Phase 0 run.
    expected: |
      Entries are present for: company settings save, language change,
      time zone change, fiscal year save, costing model save,
      integration choices, role creation, user invitation, and any
      sign-in / sign-out events.
  - n: 3
    action: |
      Open one entry — e.g., the costing model save.
    expected: |
      Detail shows actor, timestamp, prior value (none / unset), new
      value (Standard Cost), and any reason / comment captured.
expected_overall: |
  Phase 0 actions are visible in the system-wide audit log
  (audit_log_entries) with full attribution.
pass_criteria: |
  System-wide audit log (audit_log_entries) is reachable AND lists the
  major Phase 0 actions AND per-entry detail includes actor / before /
  after.
est_minutes: 5
notes: |
  Reconciled in Phase 2 — explicitly references system-wide audit log
  per L4 polish.
negative_variants:
  - id: P0-AUDIT-001-N1
    title: System-wide audit log entries cannot be edited or deleted
    action: |
      As an Administrator, attempt to edit or delete an entry in the
      system-wide audit log (audit_log_entries).
    expected: |
      The action is unavailable or blocked with a clear message that
      audit entries are immutable.
    pass_criteria: |
      Edit and delete are not possible from any UI surface.
  - id: P0-AUDIT-001-N2
    title: Non-admin user cannot read the system-wide audit log
    action: |
      Sign in as the Floor Operator from P0-USER-003 and try to
      navigate to the system-wide audit log (audit_log_entries).
    expected: |
      The system-wide audit log is hidden from navigation or returns a
      clear "permission denied" response. No audit content leaks.
    pass_criteria: |
      System-wide audit log is inaccessible to non-privileged users.
```
