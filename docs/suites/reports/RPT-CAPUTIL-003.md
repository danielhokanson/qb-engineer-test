## RPT-CAPUTIL-003 — Capacity utilization filtered to one work center matches its WO load only

```yaml
id: RPT-CAPUTIL-003
title: Capacity utilization filtered to a single work center reflects only that center's load
goal: |
  Run the capacity utilization report filtered to one work center.
  Verify the load comes only from operations at that work center —
  no leakage from operations at other centers in the same routing.
roles:
  - Production Manager
preconditions:
  - At least one routing has operations on multiple work centers
    (P2-ROUTE-001).
  - At least one WO using such a routing is scheduled (P4-WO-001).
prerequisite_cases:
  - P2-ROUTE-001
  - P4-WO-001
  - RPT-CAPUTIL-001
steps:
  - n: 1
    action: |
      Run capacity utilization filtered to work center A.
    expected: |
      Report shows load only at WC A.
  - n: 2
    action: |
      Pick one WO whose routing has operations at both WC A and WC
      B. The load on WC A's report should reflect only the WC A
      operation's hours, not the WC B operation.
    expected: |
      Hours on the WC A report match the WC A operation's hours,
      not the full routing.
  - n: 3
    action: |
      Run the report filtered to WC B for the same WO. The hours
      shown should be the WC B operation's hours.
    expected: |
      Match.
  - n: 4
    action: |
      Sum (WC A operation hours + WC B operation hours) and confirm
      it equals the routing's total scheduled hours for that WO.
    expected: |
      Match.
expected_overall: |
  Work-center filter splits multi-WC routings correctly per
  operation, with no double-counting and no missed operations.
pass_criteria: |
  Filtered hours per work center match the operation's hours within
  0.01 AND the per-WC sum equals the routing's total.
est_minutes: 10
```
