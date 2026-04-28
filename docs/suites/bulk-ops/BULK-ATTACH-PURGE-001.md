## BULK-ATTACH-PURGE-001 — Mass-delete attachments older than retention threshold

```yaml
id: BULK-ATTACH-PURGE-001
title: Bulk-delete document attachments past their retention period
goal: |
  Verify an administrator can mass-delete a set of attachments past
  the organization's retention threshold, that attachments tied to
  records still under legal hold or audit lock are excluded, and
  the parent record's attachment count is updated correctly.
roles:
  - Administrator
  - Records Administrator
capabilities:
  - CAP-CROSS-ATTACHMENTS
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 8 attachments exist with upload date older than the
    retention threshold.
  - At least 1 attachment is on a record flagged Legal Hold.
steps:
  - n: 1
    action: |
      Filter attachments to "uploaded > 7 years ago." Select all,
      including the Legal Hold one.
    expected: |
      Filter returns the relevant set.
  - n: 2
    action: |
      Choose bulk-purge. Confirm.
    expected: |
      Eligible attachments deleted. The Legal Hold attachment is
      rejected with reason "Record under Legal Hold." Per-row
      outcome shown.
  - n: 3
    action: |
      Open one of the parent records whose attachments were purged.
    expected: |
      Attachment count reflects the deletion. The audit log on the
      parent record records the bulk purge with operation ID.
expected_overall: |
  Bulk purge respects retention and legal-hold guardrails.
pass_criteria: |
  Eligible attachments removed AND legal-hold preserved AND parent
  records updated AND audit captured.
est_minutes: 8
```
