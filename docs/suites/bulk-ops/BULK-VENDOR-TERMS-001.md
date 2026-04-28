## BULK-VENDOR-TERMS-001 — Mass-update payment terms across selected vendors

```yaml
id: BULK-VENDOR-TERMS-001
title: Bulk-update payment terms across a selected set of vendors
goal: |
  Verify a Procurement user can select multiple vendors from the
  list and mass-update payment terms in a single action, with a
  per-row success / failure report.
roles:
  - Procurement
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 5 vendors exist.
prerequisite_cases:
  - P2-VENDOR-005
steps:
  - n: 1
    action: |
      Open the vendor list. Filter or select 3 vendors. Choose the
      mass-update action. Set payment terms = "Net 45."
    expected: |
      Action stages with a preview of the 3 affected records.
  - n: 2
    action: |
      Confirm.
    expected: |
      Update completes. A summary shows 3 vendors updated. Each
      vendor's terms = Net 45 in the list.
  - n: 3
    action: |
      Verify each vendor's audit log records the change.
    expected: |
      All 3 audited with prior / new terms.
expected_overall: |
  Bulk update applies cleanly with audit per record.
pass_criteria: |
  All 3 vendors updated AND audit captured per vendor AND no other
  vendors affected.
est_minutes: 6
```
