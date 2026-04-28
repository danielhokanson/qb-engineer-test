## DOC-PO-002 — PO PDF content matches the source record

```yaml
id: DOC-PO-002
title: PO PDF content matches the source record exactly
goal: |
  Verify every value on the generated PO PDF matches the underlying
  PO record: vendor, ship-to, bill-to, line items, quantities, unit
  prices, extended amounts, taxes, freight, totals, payment terms,
  delivery date, buyer name, currency, and PO revision.
roles:
  - Procurement
capabilities:
  - CAP-CROSS-DOCS
  - CAP-P2P-PO
preconditions:
  - An issued PO with at least three line items, taxes, and freight
    exists.
prerequisite_cases:
  - P3-PO-001
steps:
  - n: 1
    action: |
      Open the source PO. Note vendor, ship-to, bill-to, each line
      (part, qty, unit price, extended), tax, freight, grand total,
      payment terms, requested delivery date, currency, revision.
    expected: |
      Values are visible on the source record.
  - n: 2
    action: |
      Generate the PO PDF. Compare every captured value to the PDF.
    expected: |
      Each value on the PDF matches the source record exactly. No
      rounding drift on extended or grand total. Currency symbol
      matches the PO currency.
  - n: 3
    action: |
      Verify the PDF reflects the current PO revision number, not a
      stale one.
    expected: |
      Revision label on the PDF matches the current revision on the
      record.
expected_overall: |
  Generated PO PDF is a faithful representation of the source record.
pass_criteria: |
  All header AND line AND total AND revision values match the source
  record.
est_minutes: 6
```
