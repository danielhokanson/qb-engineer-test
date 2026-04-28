## NOTIF-APPROVAL-002 — Approval reminder escalates when ignored past second threshold

```yaml
id: NOTIF-APPROVAL-002
title: Approval still pending past escalation threshold escalates to next-level approver
goal: |
  Verify that a pending approval ignored beyond a documented escalation
  threshold (e.g., 48 hours past first reminder) escalates to the next
  approver in the chain or to a backup approver.
roles:
  - Procurement Manager
  - Controller
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-P2P-APPROVALS
preconditions:
  - An approval workflow exists with escalation policy and a defined
    next-level approver.
prerequisite_cases:
  - P3-REQ-001
  - NOTIF-APPROVAL-001
steps:
  - n: 1
    action: |
      Submit a request requiring approval. Backdate (or wait) past the
      first reminder threshold.
    expected: |
      First reminder fires for the primary approver.
  - n: 2
    action: |
      Continue past the escalation threshold without approver action.
    expected: |
      Escalation notification fires for the next-level approver.
  - n: 3
    action: |
      The next-level approver acts (approve or reject).
    expected: |
      All reminders and escalations clear. Audit shows the path.
expected_overall: |
  Escalation prevents requests from sitting indefinitely.
pass_criteria: |
  First reminder AND escalation both fire at correct thresholds AND
  clear on action AND audit trail is complete.
est_minutes: 8
```
