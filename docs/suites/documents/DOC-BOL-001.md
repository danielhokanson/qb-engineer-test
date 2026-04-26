## DOC-BOL-001 — Bill of lading generation

```yaml
id: DOC-BOL-001
title: Generate a bill of lading (BOL) for a shipment
goal: |
  Verify a BOL generates for a shipment with shipper, consignee,
  carrier, freight terms, weight, package count, hazmat block (if
  applicable).
roles:
  - Warehouse / Logistics
preconditions:
  - A shipment ready to dispatch exists.
  - Carrier and weight info are entered.
prerequisite_cases:
  - P4-SHIP
steps:
  - n: 1
    action: |
      Open the shipment. Generate the BOL.
    expected: |
      BOL PDF includes shipper, consignee, carrier, freight terms,
      package count, total weight.
  - n: 2
    action: |
      For a hazmat-flagged part, generate the BOL.
    expected: |
      Hazmat declaration block is present (UN number, hazard class).
expected_overall: |
  BOL generation is correct for both standard and hazmat shipments.
pass_criteria: |
  Standard BOL has required fields AND hazmat BOL adds hazmat fields.
est_minutes: 5
```
