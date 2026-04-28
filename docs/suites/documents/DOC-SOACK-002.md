## DOC-SOACK-002 — SO acknowledgment content matches the source order

```yaml
id: DOC-SOACK-002
title: SO acknowledgment values match the source sales order
goal: |
  Verify every value on the SO acknowledgment PDF matches the
  underlying sales order: customer, customer PO, line parts, ordered
  quantities, unit prices, promised dates, taxes, freight, grand
  total, currency.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-SO
preconditions:
  - A multi-line sales order with taxes and a freight charge exists.
prerequisite_cases:
  - P4-SO-001
steps:
  - n: 1
    action: |
      Open the source sales order. Note customer, customer PO, each
      line (part, qty, unit price, promised date), tax, freight, grand
      total, currency.
    expected: |
      Values visible on the source record.
  - n: 2
    action: |
      Generate the acknowledgment PDF. Compare each captured value to
      the PDF.
    expected: |
      Every value matches exactly. No rounding drift. Promised dates
      match per line. Currency symbol matches.
expected_overall: |
  Acknowledgment PDF accurately represents the source sales order.
pass_criteria: |
  Header AND line AND date AND total values all match.
est_minutes: 5
```
