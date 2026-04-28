## DOC-INV-005 — Invoice regenerates after correction

```yaml
id: DOC-INV-005
title: Invoice PDF regenerates correctly after a correcting action
goal: |
  Verify that when an invoice is corrected (per the system's
  correction workflow — credit-and-rebill, void-and-reissue, or
  adjustment), the resulting current document regenerates with the
  corrected values, retains a clear identifier of which version it
  is, and the audit trail links the documents.
roles:
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-CROSS-ACTIVITY-LOG
  - CAP-O2C-INVOICE
  - CAP-O2C-CREDITMEMO
preconditions:
  - A posted invoice with a generated PDF exists, and the correction
    workflow used by the system is documented.
prerequisite_cases:
  - DOC-INV-002
steps:
  - n: 1
    action: |
      Apply the system's documented correction workflow to the invoice
      (e.g., issue a credit memo and rebill, OR void and reissue, OR
      post an adjustment).
    expected: |
      Correction posts. Audit trail records what changed and links
      the related documents.
  - n: 2
    action: |
      Regenerate the relevant PDF (the rebilled invoice, the reissued
      invoice, or the adjusted invoice, per the workflow).
    expected: |
      PDF reflects the corrected values. The document carries a clear
      identifier (new invoice number, revision label, or "corrected"
      marking) so it cannot be confused with the original.
  - n: 3
    action: |
      Open the document history for the customer / invoice chain.
    expected: |
      Original and corrected documents are both retrievable, clearly
      linked, with no value mixing between them.
expected_overall: |
  Correction regeneration produces an accurate, clearly identified
  current document without polluting prior versions.
pass_criteria: |
  Corrected values present AND clear version identifier AND audit
  link AND no contamination of prior PDF.
est_minutes: 7
```
