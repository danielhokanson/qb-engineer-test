## NOTIF-PERIOD-CLOSE-002 — Period close deadline reminder cadence

```yaml
id: NOTIF-PERIOD-CLOSE-002
title: Period-close countdown reminders fire on documented schedule before deadline
goal: |
  Verify that pre-close reminders fire to the close team on the
  documented cadence (e.g., 5 / 3 / 1 days before close deadline) and
  that final-day reminders escalate to the controller.
roles:
  - Controller
  - Accounting Lead
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-ACCT-PERIOD
preconditions:
  - A fiscal period has a configured close deadline and reminder
    cadence.
prerequisite_cases:
  - P4-CLOSE-001
steps:
  - n: 1
    action: |
      Backdate (or wait) so the system is 5 days before close deadline.
    expected: |
      First reminder fires to the close team.
  - n: 2
    action: |
      Advance to 3 days before deadline, then 1 day before.
    expected: |
      Each scheduled reminder fires once (no duplicates) on its day.
  - n: 3
    action: |
      Advance to deadline day with the period still open.
    expected: |
      Final-day reminder escalates to the controller.
  - n: 4
    action: |
      Close the period.
    expected: |
      No further reminders fire for this period.
expected_overall: |
  Close-deadline reminders fire predictably and stop on close.
pass_criteria: |
  Each scheduled reminder fires exactly once AND escalation lands on
  deadline day AND reminders cease after close.
est_minutes: 8
```
