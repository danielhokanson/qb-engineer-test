## RPT-KITVAR-001 — Kitting / sub-assembly variance ties to component issue vs. BOM

```yaml
id: RPT-KITVAR-001
title: Kitting variance reconciles per-kit component-issue variance to BOM standard
goal: |
  Run the kitting / sub-assembly variance report. Verify each kit
  WO's variance equals (actual components issued - BOM standard
  qty) × component cost.
roles:
  - Production Manager
  - Controller
preconditions:
  - At least one kit / sub-assembly WO has been completed
    (P4-WO-BACKFLUSH-001 or a WO with kit/phantom BOM in P2-BOM-002).
prerequisite_cases:
  - P2-BOM-002
  - P4-WO-BACKFLUSH-001
steps:
  - n: 1
    action: |
      Run the kitting / sub-assembly variance report for the
      period.
    expected: |
      Report shows per-kit WO: BOM standard qty per component,
      actual issued qty, variance qty, variance value.
  - n: 2
    action: |
      For one closed kit WO, look up the BOM standard quantities
      and the actual issue records. Compute (actual - standard) ×
      cost per component.
    expected: |
      Computed.
  - n: 3
    action: |
      Compare to the report's WO row.
    expected: |
      Match within $0.01 per component AND total variance.
  - n: 4
    action: |
      Confirm a finished kit produced exactly to BOM has zero
      variance.
    expected: |
      Zero-variance kit shows zero.
expected_overall: |
  Kit variance reflects component-level deviation from BOM
  standard with correct sign.
pass_criteria: |
  Per-component variance matches hand computation within $0.01
  AND zero-variance kits show zero.
est_minutes: 10
```
