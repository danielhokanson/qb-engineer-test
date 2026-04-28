## RPT-VENDORPERF-004 — Drill-through from vendor performance to receipt detail

```yaml
id: RPT-VENDORPERF-004
title: Drill-through from a vendor's row opens the underlying receipt history
goal: |
  From the vendor performance report, drill into one vendor's
  performance row. Verify the drill opens the receipts (and
  associated quality records) that produced the metrics.
roles:
  - Procurement
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-P2P-RECEIVE
  - CAP-QC-INSPECTION
preconditions:
  - At least one vendor has multiple receipts including one with
    a quality issue.
prerequisite_cases:
  - P3-RECV-001
  - P3-RECV-003
  - RPT-VENDORPERF-001
steps:
  - n: 1
    action: |
      Run vendor performance for the relevant date range.
    expected: |
      Renders.
  - n: 2
    action: |
      Drill into a vendor's row.
    expected: |
      A list of that vendor's receipts opens, with promised vs.
      actual date and rejected quantity per row.
  - n: 3
    action: |
      Count: on-time receipts, defective receipts, total receipts.
      Recompute on-time % and defect %.
    expected: |
      Numbers match the parent row within rounding.
  - n: 4
    action: |
      Open one receipt from the drill list. Confirm PO number,
      receipt date, and quality outcome match the receipt record.
    expected: |
      Match.
expected_overall: |
  Drill exposes the receipts that produced the metrics and the
  hand-recompute matches.
pass_criteria: |
  Hand-recompute from drill list matches parent row within rounding
  AND a spot-checked receipt opens correctly.
est_minutes: 8
```
