## DOC-PO-001 — PO document generation

```yaml
id: DOC-PO-001
title: Generate a clean PO PDF including all standard fields
goal: |
  Verify the PO PDF generates with full header (company logo,
  vendor, PO number, terms, ship-to), line items, totals, and any
  attached terms-and-conditions.
roles:
  - Procurement
capabilities:
  - CAP-CROSS-DOCS
  - CAP-P2P-PO
preconditions:
  - At least one issued PO exists.
prerequisite_cases:
  - P3-PO-001
steps:
  - n: 1
    action: |
      Open an issued PO. Generate the PDF.
    expected: |
      PDF downloads. It includes: company info / logo, vendor address,
      PO number, line items with quantities, prices, totals, payment
      terms.
  - n: 2
    action: |
      Open the PDF in a viewer. Verify legibility, no overlapping
      text, no broken layout, no truncated long item descriptions.
    expected: |
      Layout is correct.
expected_overall: |
  PO PDF is usable as a real vendor-facing document.
pass_criteria: |
  PDF generates AND fields complete AND no layout issues.
est_minutes: 5
```
