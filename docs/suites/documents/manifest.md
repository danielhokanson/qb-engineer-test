# Documents Suite

Generation, email, print, and attachment of business documents:
purchase orders, invoices, packing slips, BOLs, statements, plus
attaching arbitrary files to records. ERPs that get document handling
wrong (PDFs that look broken, attachments that disappear, emails that
don't send) frustrate users immediately.

## ID convention

`DOC-{KIND}-NNN`.

```yaml
suite: documents
title: Document generation, email, print, and attach
description: |
  Verify each canonical business document generates correctly,
  emails reliably, prints to PDF, and arbitrary files attach to
  records.
estimated_total_minutes: 35

cases:
  - id: DOC-PO-001
  - id: DOC-INV-001
  - id: DOC-PACK-001
  - id: DOC-BOL-001
  - id: DOC-STMT-001
  - id: DOC-ATTACH-001

completion_criteria:
  - All listed documents generate to PDF.
  - At least one email-delivery case succeeds.
  - Attachments persist and re-download intact.
```
