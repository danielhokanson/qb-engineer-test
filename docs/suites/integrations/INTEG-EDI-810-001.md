## INTEG-EDI-810-001 — Outbound EDI 810 customer invoice

```yaml
id: INTEG-EDI-810-001
title: Outbound EDI 810 invoice dispatched to a customer
goal: |
  Verify that posting a customer invoice to an EDI customer
  generates and sends an 810 with line / pricing / tax / terms
  matching the posted invoice.
roles:
  - Controller
preconditions:
  - A trading partner expects 810.
  - A posted customer invoice for that customer exists.
prerequisite_cases:
  - P4-INV-001
  - INTEG-EDI-850-001
steps:
  - n: 1
    action: |
      Post an invoice to an EDI-configured customer.
    expected: |
      810 is generated and queued / dispatched.
  - n: 2
    action: |
      Inspect the 810. Verify lines, totals, taxes, terms, customer
      PO, ship-to / bill-to all match the posted invoice.
    expected: |
      Match.
  - n: 3
    action: |
      Track delivery / acknowledgment from the trading partner (a
      997 functional ack).
    expected: |
      997 is received and logged. The invoice's EDI status updates
      to "Acknowledged."
expected_overall: |
  810 dispatch and acknowledgment loop work end-to-end.
pass_criteria: |
  810 dispatched AND fields tie to invoice AND 997 acknowledged
  status visible.
est_minutes: 10
```
