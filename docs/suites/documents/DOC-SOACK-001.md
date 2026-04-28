## DOC-SOACK-001 — Sales order acknowledgment generation

```yaml
id: DOC-SOACK-001
title: Generate a sales order acknowledgment PDF
goal: |
  Verify a sales order acknowledgment PDF generates with company
  header, customer info, customer PO reference, sales order number,
  line items with promised dates, quantities, prices, totals, and
  payment / shipping terms.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-SO
preconditions:
  - At least one accepted sales order exists.
prerequisite_cases:
  - P4-SO-001
steps:
  - n: 1
    action: |
      Open an accepted sales order. Generate the acknowledgment PDF.
    expected: |
      PDF downloads. It includes company header, customer name and
      address, customer PO reference, sales order number, each line
      with promised date, quantities, unit prices, extended totals,
      grand total, payment terms, shipping terms.
  - n: 2
    action: |
      Open the PDF in a viewer.
    expected: |
      Layout is clean. No overlapping text, no truncated descriptions,
      page breaks fall between lines (not mid-line).
expected_overall: |
  Sales order acknowledgment PDF is usable as a customer-facing
  document.
pass_criteria: |
  PDF generates AND all required fields present AND layout is clean.
est_minutes: 5
```
