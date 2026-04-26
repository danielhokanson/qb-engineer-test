## P5-HR-TRAIN-001 — Training & certification record

```yaml
id: P5-HR-TRAIN-001
title: Record training and certifications with expiry on an employee
goal: |
  Verify training and certification records on an employee: capture
  course / cert, completion date, expiry date, and ensure the
  expiring-soon list surfaces upcoming renewals.
roles:
  - HR
  - Production Manager
flows:
  - hire-to-first-assignment
preconditions:
  - At least one employee exists.
prerequisite_cases:
  - P1-EMP-001
steps:
  - n: 1
    action: |
      Open the employee. Add training records:
      - "Forklift certification" — completed 2025-01-15, expires
        2027-01-15
      - "Lockout / Tagout" — completed 2025-06-01, expires 2026-06-01
    expected: |
      Both records save with their dates.
  - n: 2
    action: |
      Run the "expiring within 60 days" report (or filter the
      training list).
    expected: |
      The Lockout/Tagout cert appears (within 60 days of expiry as
      of today's date if test date is in 2026-Q2).
  - n: 3
    action: |
      Try to assign the employee to a work center that requires
      forklift cert (if such a constraint is configured).
    expected: |
      Assignment is allowed (cert valid).
  - n: 4
    action: |
      Backdate the forklift cert to expired. Re-attempt the
      assignment.
    expected: |
      Assignment is blocked or warned.
expected_overall: |
  Training / cert records surface expirations and gate work
  assignment where required.
pass_criteria: |
  Records saved AND expiring-soon report correct AND assignment
  gating respects validity.
est_minutes: 8
```
