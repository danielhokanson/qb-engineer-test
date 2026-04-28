## DOC-RMA-001 — RMA document generation

```yaml
id: DOC-RMA-001
title: Generate an RMA authorization PDF
goal: |
  Verify an RMA authorization PDF generates with company header,
  customer info, RMA number, original invoice / shipment reference,
  return reason, return-to address, line items being returned with
  quantities, expected disposition (repair / replace / credit /
  scrap), and any return shipping instructions or labels.
roles:
  - Customer Service
  - Sales / Account Manager
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-RMA
preconditions:
  - At least one approved RMA exists.
prerequisite_cases:
  - P4-RMA-001
steps:
  - n: 1
    action: |
      Open an approved RMA. Generate the authorization PDF.
    expected: |
      PDF downloads. It includes company header, customer info, RMA
      number, original invoice / shipment reference, return reason,
      return-to address, each return line with qty and disposition,
      return shipping instructions.
  - n: 2
    action: |
      Open the PDF in a viewer.
    expected: |
      Layout is correct. RMA number is prominent so it can be marked
      on returned packaging.
expected_overall: |
  RMA authorization PDF is usable as a customer-facing return
  document.
pass_criteria: |
  PDF generates AND all required fields present AND RMA number is
  prominent.
est_minutes: 5
```
