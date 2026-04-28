## DOC-PACK-003 — Packing slip prints cleanly to a standard printer

```yaml
id: DOC-PACK-003
title: Packing slip prints cleanly on letter and A4 stock
goal: |
  Verify the packing slip prints correctly on standard letter and A4
  paper without truncated edges, missing fields, page-break splits
  through a single line, or barcode unreadability.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-PICKPACK
preconditions:
  - A packed shipment with enough lines to span at least two pages
    exists.
prerequisite_cases:
  - DOC-PACK-001
steps:
  - n: 1
    action: |
      Generate the packing slip PDF. Print it to a standard letter
      printer (or full-fidelity print preview).
    expected: |
      Output is centered on the page, no edges clipped, all fields
      visible.
  - n: 2
    action: |
      Repeat for A4 paper.
    expected: |
      Output remains correctly laid out. No fields cut off by the
      different paper size.
  - n: 3
    action: |
      Verify page breaks fall between line items, not through them.
      If a barcode is present, scan it from the printout.
    expected: |
      Lines are not split. Barcode scans cleanly to the expected
      identifier.
expected_overall: |
  Packing slip is print-ready on common paper sizes.
pass_criteria: |
  Letter AND A4 print correctly AND no mid-line breaks AND barcode (if
  any) scans.
est_minutes: 6
```
