## RPT-APAGE-002 — Drill-through from AP aging to vendor invoice

```yaml
id: RPT-APAGE-002
title: AP aging drill-through opens the underlying vendor invoice with matching balance
goal: |
  From AP aging detail, drill into one vendor invoice. Verify it
  opens with matching vendor, original amount, applied payments
  and credit memos, and remaining balance.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-P2P-PO
preconditions:
  - At least one partially paid vendor invoice exists or a credit
    memo has been applied (P3-AP-CM-001).
prerequisite_cases:
  - P3-AP-001
  - P3-AP-CM-001
  - RPT-APAGE-001
steps:
  - n: 1
    action: |
      Run AP aging detail.
    expected: |
      Renders.
  - n: 2
    action: |
      Drill into a vendor invoice with a credit memo applied.
    expected: |
      Vendor invoice opens.
  - n: 3
    action: |
      Compare original - payments - credit memos to the aging row's
      balance.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Confirm a fully paid vendor invoice does NOT appear on aging.
    expected: |
      Excluded.
expected_overall: |
  Drill opens the right vendor invoice and aging reflects credit
  memos and payments correctly.
pass_criteria: |
  Aging balance = original - payments - credit memos within $0.01
  AND fully paid invoices are absent.
est_minutes: 6
```
