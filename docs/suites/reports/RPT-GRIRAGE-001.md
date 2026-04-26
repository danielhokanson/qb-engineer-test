## RPT-GRIRAGE-001 — GR/IR aging reconciles received-not-invoiced and invoiced-not-received

```yaml
id: RPT-GRIRAGE-001
title: GR/IR aging report ties to receipts not yet invoiced and invoices not yet received
goal: |
  Run the GR/IR (Goods Received / Invoice Received) aging report.
  Verify the open balances equal the sum of (receipts not matched
  to a vendor invoice) and (vendor invoices not matched to a
  receipt), bucketed by age. The GR/IR control account on the
  trial balance should equal the report grand total.
roles:
  - Controller
  - Procurement
preconditions:
  - At least one PO has been received but not yet invoiced
    (P3-RECV-001 without follow-up P3-AP-001 for that PO).
  - The GR/IR clearing account is configured and visible on the
    trial balance (P1-GL-001).
prerequisite_cases:
  - P3-RECV-001
  - P3-AP-001
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Run the GR/IR aging report as of the close date.
    expected: |
      Report shows per-PO open balance with receipt and invoice
      side and aging bucket.
  - n: 2
    action: |
      For one PO, identify receipt qty × unit price (received-not-
      invoiced) and any partial vendor-invoice qty already matched.
      Compute open GR/IR = (received × cost) - (invoiced × cost).
    expected: |
      Computed.
  - n: 3
    action: |
      Compare to the report's row.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Sum the report's grand total. Compare to the GR/IR clearing
      account balance on the trial balance.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Confirm a fully matched PO (receipt = invoice) does NOT
      appear on the report.
    expected: |
      Excluded.
expected_overall: |
  GR/IR aging ties to per-PO open mismatch and totals reconcile to
  the clearing account.
pass_criteria: |
  Per-PO open matches hand computation within $0.01 AND grand
  total equals GR/IR clearing balance within $0.01 AND fully
  matched POs are excluded.
why_this_matters: |
  GR/IR is one of the most common period-close stuck items. A
  silently growing clearing account hides duplicate payments,
  missing invoices, or pricing mismatches.
est_minutes: 12
```
