## P5-QC-COA-001 — Certificate of analysis on shipment

```yaml
id: P5-QC-COA-001
title: Generate a certificate of analysis (COA) for a shipped lot
goal: |
  Verify the system can generate a COA for a customer shipment that
  ties to the actual lot's inspection results — not a generic
  template.
roles:
  - QC Inspector
  - Sales / Account Manager
flows:
  - quote-to-cash
preconditions:
  - At least one lot-tracked finished good was inspected and shipped
    on a customer SO.
prerequisite_cases:
  - P5-QC-INSPECT-001
  - P4-SHIP
steps:
  - n: 1
    action: |
      Open a shipped SO that contained a lot-tracked product. Find
      the COA generation action.
    expected: |
      COA generation is available, scoped to the actual lot(s) shipped.
  - n: 2
    action: |
      Generate the COA.
    expected: |
      COA document includes: customer, SO, lot number(s), inspection
      results from the lot's QC record (not a generic boilerplate),
      authorized signature line.
expected_overall: |
  COA reflects the actual shipped lot's inspection data.
pass_criteria: |
  COA generated AND lot-specific data present AND no generic / placeholder
  values in inspection sections.
est_minutes: 6
```
