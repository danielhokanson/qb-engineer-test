## EDGE-DATE-DST-003 — Scheduled job at 2:30 AM behaves correctly on DST transition days

```yaml
id: EDGE-DATE-DST-003
title: A scheduled background job set for 2:30 AM runs once on fall-back and not zero times on spring-forward
goal: |
  Verify that a scheduled recurring job (e.g., nightly MRP regen)
  configured to run at 2:30 AM tenant-local does not run twice on the
  fall-back day and does not silently skip the spring-forward day.
roles:
  - Administrator
capabilities:
  - CAP-IDEN-TENANT-CONFIG
preconditions:
  - At least one recurring scheduled job exists, configurable to a
    specific tenant-local time.
  - A way to inspect the job's run history.
notes: |
  This case requires the run to either occur naturally OR the test
  environment to support time travel. If neither, mark Blocked.
steps:
  - n: 1
    action: |
      Configure (or confirm) a scheduled job at 2:30 AM tenant-local
      time. Inspect the run history across a known fall-back date.
    expected: |
      Run history shows one execution for the fall-back day, not two,
      even though 2:30 AM occurs twice on that calendar day.
  - n: 2
    action: |
      Inspect the run history across a known spring-forward date.
    expected: |
      Run history shows one execution for that day. If 2:30 AM does
      not exist (clock jumps from 2:00 to 3:00), the job either runs at
      3:00 AM or at the next valid local time — not zero times. The
      disposition is documented.
  - n: 3
    action: |
      Confirm the next-run timestamp visible in the schedule UI shows
      tenant-local time, not UTC.
    expected: |
      Display matches the user's mental model of when the job will run.
expected_overall: |
  Scheduled jobs are idempotent across DST and never silently skip.
pass_criteria: |
  Fall-back runs exactly once AND spring-forward runs exactly once AND
  the disposition for the missing hour is documented.
why_this_matters: |
  Scheduled jobs that double-run on fall-back day cause double-billing,
  duplicate emails, or duplicate MRP runs. Jobs that silently skip
  spring-forward cause stale data that morning. Both happen twice a
  year and are rarely tested before they hit.
est_minutes: 10
```
