## P0-AUDIT-001 — Admin actions log is reachable and reflects setup activity

```yaml
id: P0-AUDIT-001
title: The admin audit log captures setup activity from Phase 0
goal: |
  Verify that the audit log is reachable and shows the consequential
  admin actions performed during Phase 0 (tenant settings, role
  creation, user invitation, integration choices).
roles:
  - Administrator
  - IT Admin
flows:
  - tenant-onboarding
preconditions:
  - Phase 0 cases through P0-USER-003 have been run.
prerequisite_cases:
  - P0-USER-003
steps:
  - n: 1
    action: |
      Find and open the audit log area.
    expected: |
      Audit log opens. Filtering by date and event type is available.
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
  Phase 0 actions are visible in the audit log with full attribution.
pass_criteria: |
  Audit log is reachable AND lists the major Phase 0 actions AND
  per-entry detail includes actor / before / after.
est_minutes: 5
negative_variants:
  - id: P0-AUDIT-001-N1
    title: Audit log entries cannot be edited or deleted
    action: |
      As an Administrator, attempt to edit or delete an entry in the
      audit log.
    expected: |
      The action is unavailable or blocked with a clear message that
      audit entries are immutable.
    pass_criteria: |
      Edit and delete are not possible from any UI surface.
  - id: P0-AUDIT-001-N2
    title: Non-admin user cannot read the audit log
    action: |
      Sign in as the Floor Operator from P0-USER-003 and try to
      navigate to the audit log.
    expected: |
      The audit log is hidden from navigation or returns a clear
      "permission denied" response. No audit content leaks.
    pass_criteria: |
      Audit log is inaccessible to non-privileged users.
```
