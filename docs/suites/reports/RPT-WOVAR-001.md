## RPT-WOVAR-001 — Work order variance ties to material and labor postings

```yaml
id: RPT-WOVAR-001
title: WO variance report reconciles to actual material and labor postings
goal: |
  Run the WO variance report for closed work orders. Verify the
  material and labor variance numbers equal (actual posted - standard
  per BOM/routing) for each WO.
roles:
  - Controller
  - Production Manager
capabilities:
  - CAP-MFG-WOVARIANCE
  - CAP-MFG-COMPLETE
  - CAP-RPT-OPERATIONAL
preconditions:
  - At least one WO has been completed and closed (P4-COMP-FINAL).
prerequisite_cases:
  - P4-COMP-FINAL
steps:
  - n: 1
    action: |
      Run the WO variance report for closed WOs.
    expected: |
      Report displays standard cost, actual cost, and variance per WO,
      broken down by material and labor.
  - n: 2
    action: |
      For one closed WO, look up the BOM standard quantities and the
      actual material issued (from P4-MATL-ISSUE). Compute (actual -
      standard) at unit cost.
    expected: |
      Compute by hand or with a spreadsheet. Compare to the report.
  - n: 3
    action: |
      Repeat for labor: routing standard hours × labor rate vs. actual
      labor recorded (P4-LABOR).
    expected: |
      Compute and compare.
  - n: 4
    action: |
      Both variance lines on the report should match the hand
      calculation within $0.01.
    expected: |
      Match.
expected_overall: |
  WO variance report numbers reconcile to source material / labor.
pass_criteria: |
  Material and labor variance match the hand calculation within $0.01.
est_minutes: 12
```
