## DOC-CM-002 — Credit memo content matches posted record

```yaml
id: DOC-CM-002
title: Credit memo PDF values match the posted credit memo
goal: |
  Verify every value on the credit memo PDF matches the posted
  credit memo: bill-to, ship-to, original invoice reference, reason
  code, line parts, credited quantities, unit prices, extended
  amounts, tax adjustments, total credit, currency.
roles:
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-CREDITMEMO
preconditions:
  - A posted credit memo with at least two credited lines and a tax
    adjustment exists.
prerequisite_cases:
  - DOC-CM-001
steps:
  - n: 1
    action: |
      Open the posted credit memo. Note bill-to, ship-to, original
      invoice reference, reason, each line, tax adjustment, total
      credit, currency.
    expected: |
      Values visible on the record.
  - n: 2
    action: |
      Generate the PDF. Compare each value.
    expected: |
      All values match. Sum of credited line extendeds + tax adjustment
      equals the total credit. Currency matches.
  - n: 3
    action: |
      Verify the original invoice reference is present and correct.
    expected: |
      Reference resolves to the actual invoice being credited.
expected_overall: |
  Credit memo PDF is a faithful representation of the posted record.
pass_criteria: |
  All header AND line AND tax AND total AND reference values match.
est_minutes: 6
```
