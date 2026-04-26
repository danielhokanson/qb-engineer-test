## EDGE-DATE-DST-001 — DST transition does not lose or duplicate labor time

```yaml
id: EDGE-DATE-DST-001
title: A labor entry that spans a DST transition records correct elapsed time
goal: |
  Verify that an operator who clocks in before a daylight-savings time
  shift and clocks out after it gets credit for the actual elapsed
  hours — not one hour more (fall-back) and not one hour less
  (spring-forward).
roles:
  - Floor Operator
  - HR
  - Production Manager
preconditions:
  - The tenant is configured to a time zone that observes DST (e.g.,
    Pacific from P0-TENANT-003).
  - At least one Floor Operator user is set up with WO access.
notes: |
  This case requires the system clock to actually pass through a DST
  boundary OR the application to support backdating a labor entry
  that crosses a known DST transition. If neither is possible in the
  test environment, mark the case Blocked and report the limitation.
steps:
  - n: 1
    action: |
      Identify a known historical DST transition (e.g., the most
      recent fall-back). Backdate-create a labor entry for an operator
      that starts 30 minutes before the transition and ends 30 minutes
      after, in local clock time.
    expected: |
      Entry accepts the start and end timestamps.
  - n: 2
    action: |
      Read the recorded elapsed time on the labor entry.
    expected: |
      Elapsed time is 60 minutes, NOT 120 minutes (fall-back) or 0
      (spring-forward).
  - n: 3
    action: |
      Run the labor distribution report. The operator's time for that
      day reflects 60 minutes, not 120.
    expected: |
      Match.
expected_overall: |
  DST does not corrupt elapsed-time calculations.
pass_criteria: |
  Recorded elapsed time matches actual elapsed minutes regardless of
  the DST transition.
why_this_matters: |
  Twice a year, every labor system that gets this wrong over- or
  under-pays employees. The bug is invisible until payroll runs.
est_minutes: 10
```
