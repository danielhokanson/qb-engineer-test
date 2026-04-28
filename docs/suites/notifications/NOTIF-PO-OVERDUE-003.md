## NOTIF-PO-OVERDUE-003 — Overdue PO escalation to procurement manager

```yaml
id: NOTIF-PO-OVERDUE-003
title: PO that remains overdue past escalation threshold notifies procurement manager
goal: |
  Verify that a PO still open beyond a documented escalation window
  (e.g., 7 days past expected delivery) escalates to the procurement
  manager in addition to the buyer.
roles:
  - Procurement
  - Procurement Manager
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-P2P-PO
preconditions:
  - A PO has been overdue past the documented escalation window with no
    receipt activity. Escalation policy is configured.
prerequisite_cases:
  - P3-PO-001
  - NOTIF-PO-OVERDUE-001
steps:
  - n: 1
    action: |
      Backdate (or wait) so a PO is overdue beyond the escalation window.
    expected: |
      The procurement manager receives an escalation notification in
      addition to the buyer's standing overdue alert.
  - n: 2
    action: |
      Receive the PO fully.
    expected: |
      Both the buyer alert and the manager escalation clear.
  - n: 3
    action: |
      Inspect the PO audit trail.
    expected: |
      Audit shows the original alert, the escalation, and the resolution.
expected_overall: |
  Escalation kicks in only when the situation has stalled past the
  documented threshold.
pass_criteria: |
  Manager escalation fires only after the threshold AND not before AND
  audit trail captures both events.
est_minutes: 7
```
