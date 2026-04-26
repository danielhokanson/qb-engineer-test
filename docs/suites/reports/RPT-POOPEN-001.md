## RPT-POOPEN-001 — Open PO commitments report ties to non-received PO line value

```yaml
id: RPT-POOPEN-001
title: Open PO commitments report reconciles to PO line value not yet received
goal: |
  Run the open PO commitments report. Verify the total open
  commitment equals the sum of (PO line qty - received qty -
  short-closed qty) × unit price across all open POs, and the
  vendor breakdown sums to the grand total.
roles:
  - Procurement
  - Controller
preconditions:
  - At least one PO is open with partial receipt
    (P3-RECV-002 partial) and at least one is fully open (no
    receipts yet).
prerequisite_cases:
  - P3-PO-001
  - P3-RECV-002
  - P3-PO-SHORTCLOSE-001
steps:
  - n: 1
    action: |
      Run the open PO commitments report.
    expected: |
      Report shows per-PO and per-vendor: open qty, open value.
  - n: 2
    action: |
      For one partially received PO, compute open value = (line
      qty - received qty - short-closed qty) × unit price. Sum
      across lines.
    expected: |
      Match within $0.01 to the report's PO row.
  - n: 3
    action: |
      Sum vendor subtotals. Compare to the grand total.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Confirm a fully received PO does NOT appear (zero open).
    expected: |
      Excluded.
  - n: 5
    action: |
      Confirm a short-closed PO line is treated as zero remaining
      open (not as a backorder).
    expected: |
      Short-close excludes the line from open commitments.
expected_overall: |
  Open commitment ties to per-PO open value and short-close /
  receipt status are honored.
pass_criteria: |
  Per-PO open value matches hand computation within $0.01 AND
  fully received and short-closed are excluded AND vendor sums
  match grand total within $0.01.
why_this_matters: |
  Cash forecasting and inventory budgeting both depend on this
  number. A wrong open commitment causes either cash surprises
  or inventory shortages.
est_minutes: 12
```
