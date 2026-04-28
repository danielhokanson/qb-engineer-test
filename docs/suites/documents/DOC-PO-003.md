## DOC-PO-003 — PO regenerates correctly after revision

```yaml
id: DOC-PO-003
title: PO PDF regenerates with revised values after a PO change
goal: |
  Verify that after a PO is revised (line added, quantity changed,
  price corrected), the regenerated PDF reflects the new values, the
  revision label increments, and the prior PDF remains accessible
  from the document history if retained.
roles:
  - Procurement
capabilities:
  - CAP-CROSS-DOCS
  - CAP-CROSS-ACTIVITY-LOG
  - CAP-P2P-PO
preconditions:
  - An issued PO already has a generated and saved PDF.
prerequisite_cases:
  - DOC-PO-001
steps:
  - n: 1
    action: |
      Revise the PO. Change a line quantity AND add one new line.
      Save the revision.
    expected: |
      PO revision number increments. Audit trail records the change.
  - n: 2
    action: |
      Regenerate the PO PDF.
    expected: |
      New PDF reflects the revised quantity, the added line, and the
      updated grand total. Revision label on the PDF matches the new
      revision.
  - n: 3
    action: |
      Open the document history for the PO.
    expected: |
      Both the prior and current PDFs are listed (or, if only current
      is retained, the policy is clearly stated and consistent). No
      mixing of values between versions.
expected_overall: |
  Regeneration produces an updated, correct PDF without polluting
  prior versions.
pass_criteria: |
  Revised values present AND revision label updated AND no contamination
  of prior PDF content.
est_minutes: 6
```
