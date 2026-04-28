## P5-HR-SHIFT-001 — Shift management and assignment

```yaml
id: P5-HR-SHIFT-001
title: Build a shift schedule and confirm employees see their shifts
goal: |
  Verify the shift management workflow: define shifts, assign
  employees to shifts on a schedule, and have employees see their
  upcoming shifts in their own view.
roles:
  - Production Manager
  - HR
  - Floor Operator
flows:
  - hire-to-first-assignment
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-HR-SHIFTS
  - CAP-MD-CALENDARS
preconditions:
  - At least 3 employees and at least 2 shift definitions exist
    (P1-CAL-001, P1-CAL-002).
prerequisite_cases:
  - P1-CAL-001
  - P1-CAL-002
steps:
  - n: 1
    action: |
      Find the shift schedule area. Build a 1-week schedule covering
      both first-shift and second-shift slots; assign 3 employees
      across them.
    expected: |
      Schedule saves. The view shows the shift assignments visually.
  - n: 2
    action: |
      Sign in as one of the assigned employees. Open their schedule
      view.
    expected: |
      The employee sees their assigned shifts for the upcoming week.
  - n: 3
    action: |
      As the manager, swap two employees on a single shift.
    expected: |
      Swap saves. Both employees see the updated assignment.
expected_overall: |
  Shift scheduling propagates correctly to employee views.
pass_criteria: |
  Schedule saved AND employees see assignments AND swaps update
  cleanly.
est_minutes: 8
```
