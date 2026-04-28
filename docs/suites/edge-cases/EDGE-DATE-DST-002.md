## EDGE-DATE-DST-002 — Spring-forward labor entry does not lose an hour of pay

```yaml
id: EDGE-DATE-DST-002
title: A labor entry that spans the spring-forward DST transition records true elapsed time
goal: |
  Verify that an operator who clocks in before the spring-forward
  transition (when the clock jumps from 2:00 AM to 3:00 AM) and clocks
  out after it gets credit only for the actual elapsed time — not the
  full wall-clock difference, which would over-pay by one hour.
roles:
  - Floor Operator
  - HR
  - Production Manager
capabilities:
  - CAP-HR-TIMETRACK
  - CAP-MFG-LABOR
preconditions:
  - The tenant time zone observes DST.
  - At least one Floor Operator user exists.
notes: |
  Use a known historical spring-forward boundary OR backdate-create a
  labor entry crossing one. If neither works, mark Blocked.
steps:
  - n: 1
    action: |
      Backdate-create a labor entry starting at 1:30 AM tenant local
      time on a spring-forward Sunday and ending at 4:30 AM tenant
      local time the same day.
    expected: |
      Entry accepts the start and end timestamps.
  - n: 2
    action: |
      Read the recorded elapsed time on the entry.
    expected: |
      Elapsed time is 2 hours, NOT 3 hours. The clock skip is honored.
  - n: 3
    action: |
      Run the labor distribution report for that day.
    expected: |
      Operator's time for the day reflects 2 hours.
expected_overall: |
  Spring-forward does not over-credit elapsed time.
pass_criteria: |
  Recorded elapsed time equals true elapsed minutes across the
  spring-forward boundary.
why_this_matters: |
  Half of all DST bugs over-pay (wall-clock subtraction across spring
  forward); the other half under-pay (across fall back). Both are
  unacceptable and both need their own coverage.
est_minutes: 10
```
