## DOC-PACK-002 — Packing slip content matches the packed shipment

```yaml
id: DOC-PACK-002
title: Packing slip content matches the packed shipment exactly
goal: |
  Verify every value on the packing slip matches the packed
  shipment: customer, customer PO, ship-to address, each packed line
  with part, description, quantity packed, lot or serial numbers if
  tracked, package count, and any special handling notes. Pricing is
  not present.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-PICKPACK
  - CAP-INV-LOTS
preconditions:
  - A packed shipment with at least one lot-tracked line and a special
    handling note exists.
prerequisite_cases:
  - P4-PACK
steps:
  - n: 1
    action: |
      Open the packed shipment. Note customer, customer PO, ship-to,
      each line (part, packed qty, lot / serial), package count,
      special handling note.
    expected: |
      Values visible on the shipment record.
  - n: 2
    action: |
      Generate the packing slip PDF. Compare each captured value.
    expected: |
      All values match. Lot or serial numbers appear per line. Special
      handling note is present.
  - n: 3
    action: |
      Confirm pricing fields are absent.
    expected: |
      No unit price, extended price, or grand total appears on the
      slip.
expected_overall: |
  Packing slip accurately reflects what was packed, with no pricing
  leakage.
pass_criteria: |
  Header AND line AND lot / serial AND notes match AND pricing is
  absent.
est_minutes: 6
```
