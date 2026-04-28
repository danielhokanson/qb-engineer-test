## RPT-WOVAR-003 — Drill-through from variance line to WO / material / labor detail

```yaml
id: RPT-WOVAR-003
title: WO variance drill-through opens material and labor detail
goal: |
  From the WO variance report, drill into one WO's variance line.
  Verify the drill exposes per-material-issue and per-labor-entry
  detail that sums to the WO's variance.
roles:
  - Controller
  - Production Manager
capabilities:
  - CAP-MFG-WOVARIANCE
  - CAP-MFG-MATL-ISSUE
  - CAP-MFG-LABOR
preconditions:
  - At least one closed WO has both material and labor variance
    (P4-COMP-FINAL with quantities differing from standard).
prerequisite_cases:
  - P4-COMP-FINAL
  - RPT-WOVAR-001
steps:
  - n: 1
    action: |
      Run the WO variance report.
    expected: |
      Report renders with a row per closed WO.
  - n: 2
    action: |
      Drill into one WO's variance.
    expected: |
      A breakdown opens showing per-component material variance and
      per-operation labor variance.
  - n: 3
    action: |
      Sum the per-component material variance lines. Compare to the
      WO's total material variance on the parent report.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Sum the per-operation labor variance lines. Compare to the
      WO's total labor variance on the parent report.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Drill one more level into one material variance line. Confirm
      it lists the actual issue transactions for that component.
    expected: |
      Issue transactions list opens.
expected_overall: |
  Variance drill-through exposes the correct breakdown and each
  level reconciles to the parent.
pass_criteria: |
  Material and labor detail sums each match the parent WO variance
  within $0.01 AND the deepest drill exposes real source issues.
est_minutes: 10
```
