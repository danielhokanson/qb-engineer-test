## NOTIF-PO-OVERDUE-002 — Overdue PO alert on outstanding balance after partial receipt

```yaml
id: NOTIF-PO-OVERDUE-002
title: PO with outstanding balance past expected delivery still triggers overdue alert
goal: |
  Verify a partially-received PO whose remaining open quantity is past
  the expected delivery date still fires an overdue alert. The alert
  references the open balance, not the original ordered quantity.
roles:
  - Procurement
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-P2P-PO
  - CAP-P2P-RECEIVE
preconditions:
  - An issued PO has been partially received and has an open balance,
    with the expected delivery date in the past.
prerequisite_cases:
  - P3-PO-001
  - NOTIF-PO-OVERDUE-001
steps:
  - n: 1
    action: |
      Receive partial quantity against a PO. Backdate (or wait) so the
      expected delivery date is in the past with quantity still open.
    expected: |
      An overdue notification fires referencing the open balance
      (not the full ordered qty).
  - n: 2
    action: |
      Receive the remaining balance.
    expected: |
      Alert clears.
  - n: 3
    action: |
      Open the PO history.
    expected: |
      History records both partial receipt and the alert lifecycle.
expected_overall: |
  Partial receipts do not silence the overdue alert while balance remains.
pass_criteria: |
  Alert fires while balance is open past due AND clears only on full
  receipt AND alert content reflects open balance.
est_minutes: 7
```
