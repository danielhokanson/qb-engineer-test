## DOC-INV-003 — Invoice PDF content matches the posted invoice

```yaml
id: DOC-INV-003
title: Invoice PDF values match the posted invoice exactly
goal: |
  Verify every value on the invoice PDF matches the posted invoice:
  bill-to, ship-to, customer PO, line parts and descriptions,
  quantities, unit prices, extended amounts, taxes (per jurisdiction
  if multi-line tax), freight, grand total, due date, currency.
roles:
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-INVOICE
preconditions:
  - A posted invoice with multi-line tax (e.g., state and local) and
    freight exists.
prerequisite_cases:
  - DOC-INV-002
steps:
  - n: 1
    action: |
      Open the posted invoice. Note bill-to, ship-to, customer PO,
      each line, each tax line, freight, grand total, due date,
      currency.
    expected: |
      Values visible on the invoice record.
  - n: 2
    action: |
      Generate the PDF. Compare every captured value.
    expected: |
      All values match. Sum of line extendeds + taxes + freight equals
      the grand total. Currency symbol matches.
  - n: 3
    action: |
      Verify each tax line shows its jurisdiction label and rate.
    expected: |
      Tax lines are itemized (not collapsed into a single total) where
      multiple jurisdictions apply.
expected_overall: |
  Invoice PDF is a faithful representation of the posted invoice.
pass_criteria: |
  All header AND line AND tax AND total values match the source.
est_minutes: 6
```
