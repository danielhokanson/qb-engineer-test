## INTEG-EDI-856-001 — Outbound EDI 856 advance ship notice (ASN)

```yaml
id: INTEG-EDI-856-001
title: Outbound EDI 856 ASN dispatched at shipment
goal: |
  Verify that when a shipment goes out (P4-SHIP), the application
  generates and sends an 856 ASN to the customer with the correct
  packing structure (pack-level, item-level, serial-level if
  applicable).
roles:
  - Warehouse / Logistics
preconditions:
  - A trading partner expects 856.
  - A shipment is ready to send.
prerequisite_cases:
  - P4-SHIP
  - INTEG-EDI-850-001
steps:
  - n: 1
    action: |
      Ship a packed order to an EDI customer.
    expected: |
      856 is generated. The application's send log shows the
      dispatch.
  - n: 2
    action: |
      Inspect the generated 856 (raw or via a test partner).
    expected: |
      Pack hierarchy is correct (shipment → packs → cartons →
      items). Tracking number, ship date, and ship-to are present.
  - n: 3
    action: |
      For a serialized product, verify the 856 includes serials.
    expected: |
      Serials present at item level.
expected_overall: |
  856 dispatch is correct for both serialized and non-serialized
  products.
pass_criteria: |
  856 generated AND fields complete AND serials included where
  applicable.
est_minutes: 10
```
