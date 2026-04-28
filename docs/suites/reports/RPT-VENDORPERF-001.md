## RPT-VENDORPERF-001 — Vendor performance reflects on-time and quality history

```yaml
id: RPT-VENDORPERF-001
title: Vendor performance report ties to receipt and quality history
goal: |
  Run the vendor performance report and verify it reflects actual
  on-time, on-quality history from receipts and quality records.
roles:
  - Procurement
  - QC Inspector
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-P2P-RECEIVE
  - CAP-MD-VENDORS
preconditions:
  - At least one vendor has multiple receipts (P3-RECV-001) over time.
  - At least one of those receipts had a partial / damaged quantity
    (P3-RECV-003).
prerequisite_cases:
  - P3-RECV-001
steps:
  - n: 1
    action: |
      Run the vendor performance report covering the relevant date
      range.
    expected: |
      Report shows per vendor: on-time delivery percentage, defect
      rate, fill rate.
  - n: 2
    action: |
      For Pacific Steel Supply (or your test vendor), pull the
      receipts log. Count: how many receipts were on-or-before the
      promised date, how many were full, how many had any rejected
      quantity.
    expected: |
      Counts available.
  - n: 3
    action: |
      Compute: on-time % = (on-time count / total receipts), defect %
      = (rejected qty / total received qty), fill % = (received qty /
      ordered qty for closed POs).
    expected: |
      Numbers computed.
  - n: 4
    action: |
      Compare to the report.
    expected: |
      Match within rounding.
expected_overall: |
  Vendor performance numbers reconcile to receipt and quality records.
pass_criteria: |
  All three computed metrics match the report within rounding.
why_this_matters: |
  Procurement uses this report to make sourcing decisions. If the
  numbers don't reflect reality, vendor management is broken silently.
est_minutes: 10
```
