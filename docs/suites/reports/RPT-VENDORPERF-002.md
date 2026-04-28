## RPT-VENDORPERF-002 — Vendor performance over a custom date range

```yaml
id: RPT-VENDORPERF-002
title: Vendor performance for a custom date range respects boundaries
goal: |
  Run the vendor performance report for a date range that excludes
  some historical receipts. Verify on-time %, defect %, and fill
  % are computed only from receipts dated within the range.
roles:
  - Procurement
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-P2P-RECEIVE
preconditions:
  - One vendor has receipts spanning multiple periods (some good,
    some late, some with rejected qty), enough to make a date-
    bounded slice meaningful.
prerequisite_cases:
  - P3-RECV-001
  - P3-RECV-003
  - RPT-VENDORPERF-001
steps:
  - n: 1
    action: |
      Run vendor performance for a 60-day window.
    expected: |
      Report renders for that window.
  - n: 2
    action: |
      Pull only the receipts within that 60-day window. Hand-
      compute on-time %, defect %, fill %.
    expected: |
      Compute.
  - n: 3
    action: |
      Compare to the report.
    expected: |
      Match within rounding.
  - n: 4
    action: |
      Confirm a receipt from outside the window does NOT influence
      the metrics.
    expected: |
      Excluded.
expected_overall: |
  Performance metrics correctly bound to the date range with no
  leakage.
pass_criteria: |
  All three metrics match the date-windowed hand computation within
  rounding AND outside-window receipts are excluded.
est_minutes: 8
```
