## NOTIF-PO-OVERDUE-001 — Overdue PO alert past expected delivery

```yaml
id: NOTIF-PO-OVERDUE-001
title: PO past expected delivery date triggers an overdue alert
goal: |
  Verify that an issued PO whose expected delivery date has passed
  without full receipt fires an overdue alert to the buyer and / or
  buyer team.
roles:
  - Procurement
preconditions:
  - At least one issued PO with an expected delivery date in the past
    and not fully received.
prerequisite_cases:
  - P3-PO-001
steps:
  - n: 1
    action: |
      Issue (or backdate) a PO so its expected delivery date is in
      the past with no receipts.
    expected: |
      An overdue notification fires for the buyer.
  - n: 2
    action: |
      Receive the PO fully.
    expected: |
      Alert clears.
  - n: 3
    action: |
      Open the PO. Verify the alert history is auditable.
    expected: |
      History shows the alert fired and resolved.
expected_overall: |
  Overdue PO alert fires and clears.
pass_criteria: |
  Alert present after due date AND cleared on receipt AND history
  recorded.
est_minutes: 5
```
