## BULK-QUOTE-DELETE-001 — Mass-delete expired draft quotes

```yaml
id: BULK-QUOTE-DELETE-001
title: Bulk-delete draft quotes that have expired and never converted
goal: |
  Verify a sales admin can mass-delete a filtered set of expired
  draft quotes that never converted to an order, that any quote
  with a downstream link (converted SO, attached document) is
  excluded, and the operation is recorded in the system-wide audit
  log (audit_log_entries) at the operation level even though
  individual records are gone.
roles:
  - Sales Administrator
preconditions:
  - At least 6 draft quotes exist with expiry date in the past.
  - At least 1 of them is linked to a converted SO.
steps:
  - n: 1
    action: |
      Filter quotes to "status = Draft AND expiry < today." Select
      all, including the one with a converted SO.
    expected: |
      Filter returns the relevant set.
  - n: 2
    action: |
      Choose bulk-delete. Confirm.
    expected: |
      Per-row outcome shown. Quotes with no downstream link are
      deleted. The quote linked to a converted SO is rejected with
      reason "Linked to SO-NNN — cannot delete."
  - n: 3
    action: |
      Check the system-wide audit log (audit_log_entries) for the
      bulk-delete operation entry.
    expected: |
      Bulk-delete operation captured (who, when, count, IDs deleted)
      even though the underlying quote rows are gone.
expected_overall: |
  Mass delete respects downstream references and is recorded at the
  operation level in the system-wide audit log.
pass_criteria: |
  Eligible quotes deleted AND linked quote preserved with reason AND
  operation-level entry retained in the system-wide audit log
  (audit_log_entries).
est_minutes: 7
notes: |
  Reconciled in Phase 2 — explicitly references system-wide audit log
  per L4 polish.
```
