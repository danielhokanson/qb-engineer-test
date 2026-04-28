## DOC-INV-004 — Invoice prints cleanly on standard paper

```yaml
id: DOC-INV-004
title: Invoice prints cleanly on letter and A4 stock
goal: |
  Verify the invoice PDF prints correctly on letter and A4 paper
  with no edge clipping, no fields cut off, page breaks falling
  between lines, and remit-to / payment-terms blocks intact on the
  final page.
roles:
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-INVOICE
preconditions:
  - A posted invoice with enough lines to span at least two pages
    exists.
prerequisite_cases:
  - DOC-INV-002
steps:
  - n: 1
    action: |
      Generate the invoice PDF. Print it to letter (or full-fidelity
      print preview).
    expected: |
      Output is correctly centered, no edges clipped, all fields
      visible.
  - n: 2
    action: |
      Repeat for A4.
    expected: |
      Output remains correctly laid out. Remit-to and payment terms
      blocks are not pushed off the page.
  - n: 3
    action: |
      Verify page breaks fall between lines, not through a line.
    expected: |
      Each line item is intact on a single page.
expected_overall: |
  Invoice PDF is print-ready on common paper sizes.
pass_criteria: |
  Letter AND A4 print correctly AND no mid-line breaks AND remit-to
  block intact.
est_minutes: 6
```
