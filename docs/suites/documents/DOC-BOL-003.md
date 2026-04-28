## DOC-BOL-003 — BOL attaches to the source shipment record

```yaml
id: DOC-BOL-003
title: Generated BOL is attached to the source shipment record
goal: |
  Verify a generated BOL is automatically attached to its shipment
  record (or saved into a documents area scoped to the shipment),
  retrievable by anyone with permission to view the shipment, and
  re-downloadable identically later.
roles:
  - Warehouse / Logistics
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-CROSS-ATTACHMENTS
  - CAP-O2C-SHIP
preconditions:
  - A shipment ready to dispatch exists.
prerequisite_cases:
  - DOC-BOL-001
steps:
  - n: 1
    action: |
      Generate the BOL. Reload the shipment record.
    expected: |
      BOL appears in the shipment's documents / attachments area with
      filename, generated-by, timestamp, and a download link.
  - n: 2
    action: |
      Have a second user (with shipment view permission) open the
      shipment.
    expected: |
      BOL is visible to that user. They can download it.
  - n: 3
    action: |
      Re-download the BOL. Compare with the originally generated PDF.
    expected: |
      Re-downloaded file is identical (same size, same content) to
      the original.
expected_overall: |
  Generated BOL persists on the shipment record and remains accessible.
pass_criteria: |
  Attachment present AND visible to authorized users AND re-download
  intact.
est_minutes: 5
```
