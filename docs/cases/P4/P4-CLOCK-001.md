## P4-CLOCK-001 — Operator clock-in / clock-out independent of WO start

```yaml
id: P4-CLOCK-001
title: Operator clocks in for a shift; labor on a WO posts within shift hours
goal: |
  Verify that an operator's shift clock-in / clock-out is recorded
  independently of WO-level labor, and that the day's WO labor sums
  cannot exceed total shift attendance.
roles:
  - Floor Operator
  - HR
flows:
  - hire-to-first-assignment
preconditions:
  - A Floor Operator user exists.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      As Floor Operator, scan the shift clock-in barcode at start of
      shift.
    expected: |
      Clock-in recorded with timestamp.
  - n: 2
    action: |
      Start a WO and accumulate labor on it. Stop. Start another WO,
      accumulate, stop.
    expected: |
      Two WO labor entries are recorded inside the shift.
  - n: 3
    action: |
      Scan clock-out at end of shift.
    expected: |
      Clock-out recorded.
  - n: 4
    action: |
      Run the daily attendance / labor report for this operator.
    expected: |
      Total shift hours displayed AND sum of WO labor ≤ shift hours.
      Indirect / unclocked time is shown as a reconciling line.
expected_overall: |
  Shift attendance and WO labor reconcile cleanly.
pass_criteria: |
  Shift hours captured AND WO labor sums fit inside shift AND any
  difference shows as indirect time.
est_minutes: 8
```
