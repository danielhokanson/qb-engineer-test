## DOC-PACK-001 — Packing slip generation

```yaml
id: DOC-PACK-001
title: Generate a packing slip from a packed shipment
goal: |
  Verify the packing slip generates with: customer info, customer
  PO, ship-to address, line items with quantities, any special
  handling notes, no pricing.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-PICKPACK
preconditions:
  - A packed (but possibly not yet shipped) order exists.
prerequisite_cases:
  - P4-PACK
steps:
  - n: 1
    action: |
      Open the packed order. Generate the packing slip PDF.
    expected: |
      Packing slip generates with the listed fields. Pricing is
      omitted by design.
  - n: 2
    action: |
      Verify the PDF prints correctly to a standard printer (or
      preview matches a print-ready layout).
    expected: |
      Print preview is correct.
expected_overall: |
  Packing slip is generation-ready.
pass_criteria: |
  Slip generates AND has all needed fields AND no pricing.
est_minutes: 4
```
