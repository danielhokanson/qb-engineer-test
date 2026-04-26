## DOC-ATTACH-001 — Attach a file to a record

```yaml
id: DOC-ATTACH-001
title: Attach a file to a record and verify retrieval
goal: |
  Verify arbitrary files (PDFs, images, drawings) can be attached
  to records (PO, customer, part, WO), are scoped to the record,
  retrievable later, and respect any storage / size limits with
  clear messages.
roles:
  - Engineer / R&D
  - Procurement
preconditions:
  - At least one part record exists.
steps:
  - n: 1
    action: |
      Open a part record. Attach a PDF drawing (e.g., 2 MB).
    expected: |
      Upload completes. File is listed under attachments with
      filename, size, uploaded-by, timestamp.
  - n: 2
    action: |
      Reload the record. Re-download the file.
    expected: |
      File downloads identically (matching size; identical content).
  - n: 3
    action: |
      Try to upload an oversized file (e.g., over the documented
      limit).
    expected: |
      Upload is rejected with a clear message about the size limit.
      Other attachments are unaffected.
  - n: 4
    action: |
      Open a different record (e.g., a different part) and verify
      the attachment is NOT visible there.
    expected: |
      Attachment is scoped to its record only.
expected_overall: |
  Attachments persist and are correctly scoped.
pass_criteria: |
  File uploaded AND re-downloaded intact AND oversized clearly
  rejected AND scoping respected.
est_minutes: 6
```
