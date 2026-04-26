## INTEG-EDI-855-001 — Outbound EDI 855 PO acknowledgment

```yaml
id: INTEG-EDI-855-001
title: Outbound EDI 855 acknowledges an incoming customer PO
goal: |
  Verify that after ingesting an 850 (or accepting a customer PO),
  the application generates and dispatches a corresponding 855
  (PO acknowledgment) with the right approval / change codes.
roles:
  - Sales / Account Manager
preconditions:
  - At least one inbound 850 has produced an SO (per
    INTEG-EDI-850-001).
prerequisite_cases:
  - INTEG-EDI-850-001
steps:
  - n: 1
    action: |
      Confirm or accept the SO derived from an inbound 850.
    expected: |
      An 855 generation action is available (or auto-fires).
  - n: 2
    action: |
      Generate / send the 855.
    expected: |
      855 is dispatched to the trading partner. The application logs
      the send.
  - n: 3
    action: |
      Modify a line price on the SO. Re-send 855.
    expected: |
      Updated 855 reflects the price change with the appropriate
      change code, NOT silently confirming the original.
expected_overall: |
  855 reflects the SO's actual state with proper change codes.
pass_criteria: |
  855 dispatched AND fields match SO AND change reflected on
  resend.
est_minutes: 8
```
