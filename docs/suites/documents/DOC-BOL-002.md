## DOC-BOL-002 — BOL content matches shipment and freight terms

```yaml
id: DOC-BOL-002
title: BOL content matches the shipment, carrier, and freight terms
goal: |
  Verify the BOL accurately reflects shipper, consignee, carrier name
  and SCAC, freight terms (prepaid / collect / third-party), package
  count, total weight, declared value if used, and NMFC class /
  description per line where applicable.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-SHIP
preconditions:
  - A shipment ready to dispatch with carrier, weight, package count,
    and freight terms entered exists.
prerequisite_cases:
  - DOC-BOL-001
steps:
  - n: 1
    action: |
      Open the shipment. Note shipper, consignee, carrier and SCAC,
      freight terms, package count, total weight, declared value (if
      used), each line's NMFC class / description if used.
    expected: |
      Values visible on the shipment record.
  - n: 2
    action: |
      Generate the BOL. Compare each captured value to the BOL PDF.
    expected: |
      All header values match. Freight terms render as the selected
      option (prepaid / collect / third-party). Per-line NMFC values
      match.
  - n: 3
    action: |
      Sum the package weights on the BOL.
    expected: |
      Sum equals the total weight on the shipment record (within
      stated rounding).
expected_overall: |
  BOL faithfully represents the dispatched shipment.
pass_criteria: |
  All header AND line AND total weight values match the source.
est_minutes: 6
```
