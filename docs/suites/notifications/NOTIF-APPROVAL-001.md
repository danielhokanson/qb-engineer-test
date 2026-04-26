## NOTIF-APPROVAL-001 — Approval reminder for pending requests

```yaml
id: NOTIF-APPROVAL-001
title: Pending approval that's been waiting beyond a threshold reminds the approver
goal: |
  Verify that a pending approval (e.g., requisition, PO, ECR, JE)
  that's been waiting beyond a documented threshold fires a reminder
  to the approver.
roles:
  - Procurement
  - Production Manager
  - Controller
preconditions:
  - At least one approval workflow exists with a documented reminder
    threshold (e.g., 24 hours).
prerequisite_cases:
  - P3-REQ-001
  - P2-RD-002
steps:
  - n: 1
    action: |
      Submit a requisition (or ECR / JE) requiring approval. Wait
      past the threshold (or backdate the submission).
    expected: |
      A reminder notification fires for the approver.
  - n: 2
    action: |
      Approve or reject.
    expected: |
      Reminder clears.
expected_overall: |
  Approval reminders nudge approvers without spamming them.
pass_criteria: |
  Reminder fires past threshold AND clears on action AND not duplicated.
est_minutes: 5
```
