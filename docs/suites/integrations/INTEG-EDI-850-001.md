## INTEG-EDI-850-001 — Inbound EDI 850 purchase order

```yaml
id: INTEG-EDI-850-001
title: Inbound EDI 850 from a customer creates a sales order
goal: |
  Verify the application can ingest an EDI 850 (PO from a customer)
  and create a corresponding sales order with correct customer,
  line items, prices, and ship-to / bill-to.
roles:
  - Sales / Account Manager
  - IT Admin
preconditions:
  - The application supports EDI inbound (or has a test trading
    partner configured).
  - At least one customer is set up for EDI.
steps:
  - n: 1
    action: |
      Submit a sample EDI 850 file (with customer / part numbers
      mapped per the trading partner's specification).
    expected: |
      File is ingested. Sales order is created in draft (or open)
      status.
  - n: 2
    action: |
      Open the SO. Verify customer, lines, prices, ship-to, customer
      PO, and date all came through.
    expected: |
      All fields match the 850.
  - n: 3
    action: |
      Submit a malformed 850 (bad segment).
    expected: |
      File is rejected. Error is logged. SO is NOT created. The user
      can see what's wrong.
expected_overall: |
  EDI 850 inbound creates SOs cleanly with error visibility on
  malformed input.
pass_criteria: |
  Valid 850 → SO with matching fields AND malformed 850 produces a
  clear error.
est_minutes: 10
```
