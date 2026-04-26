## RPT-ARAGE-002 — Drill-through from AR aging to invoice opens correct invoice

```yaml
id: RPT-ARAGE-002
title: AR aging drill-through opens the underlying invoice with matching balance
goal: |
  From the AR aging detail report, drill into one invoice line.
  Verify the invoice opens with matching customer, original amount,
  applied payments, and remaining balance.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - At least one partially paid invoice exists (P4-CASH-PARTIAL).
prerequisite_cases:
  - P4-INV-001
  - P4-CASH-PARTIAL
  - RPT-ARAGE-001
steps:
  - n: 1
    action: |
      Run the AR aging detail.
    expected: |
      Renders.
  - n: 2
    action: |
      Drill into a partially paid invoice's row.
    expected: |
      The invoice record opens.
  - n: 3
    action: |
      Compare original amount, payments applied, and remaining
      balance on the invoice to the aging row's balance.
    expected: |
      Aging row balance = original - payments applied within $0.01.
  - n: 4
    action: |
      Drill into a fully paid invoice (should NOT appear on the
      aging report). Confirm it doesn't show.
    expected: |
      Excluded from aging.
expected_overall: |
  Drill-through opens the right invoice and aging balance reflects
  payments correctly.
pass_criteria: |
  Aging balance = invoice original - payments within $0.01 AND
  fully paid invoices are absent from aging.
est_minutes: 6
```
