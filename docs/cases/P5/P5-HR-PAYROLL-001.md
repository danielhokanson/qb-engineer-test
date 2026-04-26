## P5-HR-PAYROLL-001 — Time approval and payroll feed

```yaml
id: P5-HR-PAYROLL-001
title: Approve pay-period time and produce a payroll-export feed
goal: |
  Verify the time-to-payroll workflow: time entries are approved by
  the manager, the system computes regular vs. overtime hours per
  classification, and a payroll feed (file or integration) is produced
  matching the approved data.
roles:
  - HR
  - Production Manager
  - Controller
flows:
  - hire-to-first-assignment
preconditions:
  - Multiple labor entries from at least 2 employees in the pay period
    exist (P4-LABOR).
  - At least one employee is non-exempt (overtime eligible).
prerequisite_cases:
  - P4-LABOR
  - P1-EMP-003
steps:
  - n: 1
    action: |
      As the manager, open the time-approval queue for the pay
      period. Approve all pending entries.
    expected: |
      Approvals save.
  - n: 2
    action: |
      For a non-exempt employee with > 40 hrs in the week, verify
      the system splits hours into regular and overtime per the
      configured rule.
    expected: |
      OT hours are computed correctly (e.g., FLSA 40-hour rule).
  - n: 3
    action: |
      Generate the payroll feed (file export or integration push).
    expected: |
      File / payload contains every approved employee, regular hours,
      OT hours, pay rate, and gross pay.
  - n: 4
    action: |
      Spot-check one row against the source.
    expected: |
      Match.
expected_overall: |
  Time approves cleanly and payroll feed reflects approved data.
pass_criteria: |
  Approvals complete AND OT computed correctly AND feed matches
  source.
est_minutes: 12
```
