## DOC-INV-002 — Invoice PDF generation

```yaml
id: DOC-INV-002
title: Generate a customer invoice PDF including all standard fields
goal: |
  Verify the invoice PDF generates with company header, bill-to,
  ship-to, invoice number, invoice date, due date, customer PO,
  line items with quantities, unit prices, extended amounts, taxes,
  freight, grand total, payment terms, and remit-to instructions.
roles:
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-INVOICE
preconditions:
  - At least one posted customer invoice exists.
prerequisite_cases:
  - P4-INV-001
steps:
  - n: 1
    action: |
      Open a posted invoice. Generate the PDF.
    expected: |
      PDF downloads. It includes company header, bill-to, ship-to,
      invoice number, invoice date, due date, customer PO, each line
      with qty / unit price / extended, tax, freight, grand total,
      payment terms, remit-to.
  - n: 2
    action: |
      Open the PDF in a viewer.
    expected: |
      Layout is correct. No overlapping text, no truncated
      descriptions, page breaks between lines.
expected_overall: |
  Invoice PDF is usable as a customer-facing document.
pass_criteria: |
  PDF generates AND all required fields present AND layout is clean.
est_minutes: 5
```
