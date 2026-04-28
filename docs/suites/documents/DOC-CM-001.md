## DOC-CM-001 — Credit memo generation

```yaml
id: DOC-CM-001
title: Generate a customer credit memo PDF
goal: |
  Verify a credit memo PDF generates with company header, bill-to,
  ship-to, credit memo number, credit memo date, original invoice
  reference (if applicable), reason code, line items being credited
  with quantities and unit prices, taxes adjusted, total credit
  amount, and remit-to instructions where the credit applies.
roles:
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-CREDITMEMO
preconditions:
  - At least one posted credit memo (against a prior invoice) exists.
prerequisite_cases:
  - P4-CM-001
steps:
  - n: 1
    action: |
      Open a posted credit memo. Generate the PDF.
    expected: |
      PDF downloads. It includes company header, bill-to, ship-to,
      credit memo number, date, original invoice reference, reason,
      each credited line, taxes, total credit, remit-to instructions.
  - n: 2
    action: |
      Open the PDF in a viewer.
    expected: |
      Layout is correct. Total credit clearly indicated as a credit
      (negative or labeled "credit"), not ambiguous with an invoice.
expected_overall: |
  Credit memo PDF is usable as a customer-facing document.
pass_criteria: |
  PDF generates AND all required fields present AND credit clearly
  indicated.
est_minutes: 5
```
