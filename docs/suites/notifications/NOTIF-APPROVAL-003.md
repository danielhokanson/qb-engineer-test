## NOTIF-APPROVAL-003 — Approval reminder respects active delegation

```yaml
id: NOTIF-APPROVAL-003
title: Approval reminders route to the delegate when primary approver is on delegation
goal: |
  Verify that when the primary approver has an active delegation
  configured (e.g., out-of-office), reminders for pending approvals
  route to the delegate, not the primary, for the duration of the
  delegation window.
roles:
  - Procurement
  - Controller
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-P2P-APPROVALS
preconditions:
  - An approval workflow exists.
  - Primary approver has an active delegation set to a backup user.
prerequisite_cases:
  - P3-REQ-001
  - NOTIF-APPROVAL-001
steps:
  - n: 1
    action: |
      Submit a request requiring approval while the delegation window
      is active.
    expected: |
      The delegate receives the initial approval notification. The
      primary does not (or receives a copy only if policy says so).
  - n: 2
    action: |
      Wait past the reminder threshold without action.
    expected: |
      The reminder fires to the delegate, not the primary.
  - n: 3
    action: |
      End the delegation window. Submit a new request.
    expected: |
      The new request and its reminders go to the primary.
expected_overall: |
  Delegation correctly redirects routing for the duration of the window.
pass_criteria: |
  Delegate receives reminders during window AND primary receives them
  outside of window AND audit records the delegation routing.
est_minutes: 8
```
