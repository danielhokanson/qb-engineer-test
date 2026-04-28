## EDGE-DATE-TZSHIFT-003 — Shift schedule for a worker who travels across time zones updates correctly

```yaml
id: EDGE-DATE-TZSHIFT-003
title: An employee who changes assigned time zone mid-pay-period has their schedule and worked hours reconciled cleanly
goal: |
  Verify that when a worker's assigned time zone changes (e.g., a
  field engineer relocates from US Eastern to US Pacific), their
  schedule and recorded hours before the change remain anchored to
  the old zone, and entries after anchor to the new zone, with no
  retroactive shift of past records.
roles:
  - Administrator
  - HR
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-HR-TIMETRACK
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one employee with two recorded shifts before today.
  - Employee time zone is editable.
notes: |
  If per-employee time zone is not supported, mark Not Applicable.
steps:
  - n: 1
    action: |
      Read the two existing shifts in the employee's current zone
      (e.g., Eastern). Record the start and end timestamps shown.
    expected: |
      Times visible in Eastern.
  - n: 2
    action: |
      Update the employee's assigned time zone to Pacific. Save.
    expected: |
      Application accepts the change. Audit log captures it.
  - n: 3
    action: |
      Re-read the two pre-change shifts.
    expected: |
      The shifts continue to reflect the same true instant. They are
      either still shown in Eastern (anchored to original zone) or
      shown in Pacific with their underlying instant unchanged. The
      elapsed minutes are unchanged. Choose ONE display rule and
      document it; do not silently shift the times by 3 hours.
  - n: 4
    action: |
      Create a new shift after the zone change.
    expected: |
      New shift records in Pacific.
expected_overall: |
  Zone change is forward-only and never silently rewrites historical
  hours.
pass_criteria: |
  Pre-change shifts retain original elapsed time AND no silent 3-hour
  rewrite occurred AND new shifts honor the new zone.
why_this_matters: |
  Silent retroactive time-zone shifts on historical labor records is
  a payroll-correctness disaster. The change has to be forward-only
  with auditable provenance.
est_minutes: 12
```
