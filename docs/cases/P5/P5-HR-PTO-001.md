## P5-HR-PTO-001 — Paid time off (PTO) request and approval

```yaml
id: P5-HR-PTO-001
title: Employee submits a PTO request; manager approves; balance updates
goal: |
  Verify employees can request PTO, managers approve / deny, the
  balance updates correctly, and approved PTO appears on the
  scheduling / capacity view so planners avoid over-booking.
roles:
  - HR
  - Floor Operator
  - Production Manager
flows:
  - hire-to-first-assignment
preconditions:
  - At least one employee with a configured PTO accrual policy exists.
steps:
  - n: 1
    action: |
      As the employee, find the PTO area. Submit a request: 2 days
      next month.
    expected: |
      Request saves in "Pending" status. Available PTO balance is
      visible.
  - n: 2
    action: |
      As the manager, open the PTO approval queue. Approve.
    expected: |
      Status changes to "Approved." The balance reservation updates.
  - n: 3
    action: |
      Open the production capacity view for the requested days.
    expected: |
      The employee's availability shows as "On PTO" and they're not
      assignable on those days.
  - n: 4
    action: |
      Once the dates pass, balance is debited.
    expected: |
      PTO balance reduces by 2 days.
expected_overall: |
  PTO request → approval → balance update → scheduling integration
  works end-to-end.
pass_criteria: |
  Approval flow complete AND balance debited AND scheduling reflects
  PTO.
est_minutes: 8
```
