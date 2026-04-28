## EDGE-DATE-DST-004 — Time-stamped system-wide audit log entries near a DST transition remain monotonic

```yaml
id: EDGE-DATE-DST-004
title: System-wide audit log entries spanning a DST transition remain in chronological order
goal: |
  Verify that the system-wide audit log (audit_log_entries), which
  captures cross-cutting state-changing actions, presents events in
  true chronological order across a DST transition — not naive
  wall-clock order, which would put a fall-back event before its
  predecessor.
roles:
  - Administrator
capabilities:
  - CAP-IDEN-AUDIT-SYSTEM-LOG
preconditions:
  - The tenant time zone observes DST.
  - The system-wide audit log (audit_log_entries) is populated with at
    least a handful of recent actions.
steps:
  - n: 1
    action: |
      Identify (or backdate-create) two system-wide audit log events
      that bracket a fall-back DST transition — one at 1:30 AM
      tenant-local before the transition, one at 1:30 AM after.
    expected: |
      Both events appear in the system-wide audit log
      (audit_log_entries).
  - n: 2
    action: |
      Read the system-wide audit log (audit_log_entries) sorted by
      timestamp.
    expected: |
      The earlier event appears first; the later event appears second.
      No reordering or visual ambiguity, even though both display 1:30
      AM tenant-local. The display disambiguates (e.g., shows offset:
      1:30 AM PDT vs 1:30 AM PST).
  - n: 3
    action: |
      Filter the system-wide audit log by the calendar day of the
      transition.
    expected: |
      Both events are returned. Order remains correct.
expected_overall: |
  System-wide audit log (audit_log_entries) preserves true
  chronological order across DST.
pass_criteria: |
  Events display in true time order AND the display unambiguously
  distinguishes the two 1:30 AM occurrences.
why_this_matters: |
  System-wide audit logs are the legal record of who did what when.
  Out-of-order events on DST day undermine the entire audit story.
est_minutes: 8
notes: |
  Reconciled in Phase 2 — explicitly references system-wide audit log
  per L4 polish.
```
