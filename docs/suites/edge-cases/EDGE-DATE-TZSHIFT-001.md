## EDGE-DATE-TZSHIFT-001 — A shift that crosses midnight is one shift, not two

```yaml
id: EDGE-DATE-TZSHIFT-001
title: A labor shift that starts before and ends after tenant midnight is recorded as a single continuous shift
goal: |
  Verify that an operator's overnight shift (e.g., 10:00 PM to 6:00 AM
  tenant-local) records as one continuous shift with eight elapsed
  hours — not split into a 2-hour day-1 shift and a 6-hour day-2
  shift, and not duplicated.
roles:
  - Floor Operator
  - HR
  - Production Manager
capabilities:
  - CAP-HR-TIMETRACK
  - CAP-MFG-LABOR
  - CAP-HR-SHIFTS
preconditions:
  - At least one Floor Operator user with labor-entry capability.
  - Shift configuration that permits overnight work.
steps:
  - n: 1
    action: |
      Backdate-create (or live-create) a labor entry from 10:00 PM
      tenant-local to 6:00 AM tenant-local the following day.
    expected: |
      Entry accepts both timestamps.
  - n: 2
    action: |
      Read the elapsed time and shift count for the operator across
      the two calendar days.
    expected: |
      Elapsed time is 8 hours. Exactly one shift entry exists for
      this work, not two.
  - n: 3
    action: |
      Run the labor distribution report by shift.
    expected: |
      The 8-hour shift appears once. It is attributed to the shift
      configuration the operator was scheduled under (e.g., "Night
      shift"), not split between two day shifts.
  - n: 4
    action: |
      Run the labor distribution report by calendar day.
    expected: |
      Hours are reported by the application's documented rule —
      either fully on the start date, fully on the end date, or
      proportionally split — and the rule is visible. The total
      across both days equals 8 hours.
expected_overall: |
  Overnight shifts are first-class and not double-counted.
pass_criteria: |
  Single 8-hour shift recorded AND no double-count across calendar
  days AND day-attribution rule is documented.
why_this_matters: |
  Manufacturing runs 24/7. A system that splits or duplicates
  overnight shifts mis-pays workers and mis-reports OEE on the
  backbone of factory operations.
est_minutes: 10
```
