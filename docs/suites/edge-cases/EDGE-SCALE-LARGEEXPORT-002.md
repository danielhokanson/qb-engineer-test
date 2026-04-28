## EDGE-SCALE-LARGEEXPORT-002 — Concurrent large exports do not corrupt each other's files

```yaml
id: EDGE-SCALE-LARGEEXPORT-002
title: Two users running large exports at the same time each get their own complete, uncorrupted file
goal: |
  Verify that two users initiating large CSV exports simultaneously
  each receive a complete, distinct, uncorrupted file — no file
  swapping, no row interleaving, no partial overlap.
roles:
  - Administrator
  - Controller
capabilities:
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-CONCURRENCY
preconditions:
  - 5,000+ records exist for at least two exportable entities.
  - Two distinct user sessions are available.
steps:
  - n: 1
    action: |
      As User A, start an export of all 5,000+ parts.
    expected: |
      Export starts.
  - n: 2
    action: |
      As User B (different session, ideally different browser), start
      an export of all 5,000+ vendors within five seconds of User A.
    expected: |
      Export starts independently.
  - n: 3
    action: |
      Both exports complete. Each user downloads their respective file.
    expected: |
      Each file is the right entity (A gets parts, B gets vendors).
  - n: 4
    action: |
      Open both files. Confirm row counts match the source views and
      no rows from the other entity appear in either file.
    expected: |
      Files are distinct and complete. No cross-contamination.
expected_overall: |
  Concurrent exports are isolated and complete.
pass_criteria: |
  Each file has the right entity AND the right row count AND no rows
  from the other entity AND no truncation.
why_this_matters: |
  Shared temp-file paths or shared streaming buffers across user
  sessions are a classic concurrency bug — the kind that only shows
  up under load and corrupts user-visible exports without warning.
est_minutes: 12
```
