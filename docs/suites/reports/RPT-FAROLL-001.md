## RPT-FAROLL-001 — Fixed-asset roll-forward ties opening + activity = closing

```yaml
id: RPT-FAROLL-001
title: Fixed-asset roll-forward reconciles opening, additions, disposals, depreciation, ending
goal: |
  Run the fixed-asset roll-forward report (opening cost + additions
  - disposals = ending cost; opening accumulated + depreciation -
  disposals = ending accumulated). Verify each column ties to the
  underlying activity in the period.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-MD-ASSETS
  - CAP-ACCT-DEPRECIATION
  - CAP-MAINT-ASSETLIFECYCLE
preconditions:
  - The period had at least one asset addition (P3-ASSET-COMM-001),
    one disposal/retirement (P5-ASSET-RETIRE-001), and one period
    of depreciation (P5-CLOSE-003).
prerequisite_cases:
  - P3-ASSET-COMM-001
  - P5-ASSET-RETIRE-001
  - P5-CLOSE-003
steps:
  - n: 1
    action: |
      Run the fixed-asset roll-forward for the period.
    expected: |
      Report shows by category (or asset class):
      cost: opening, additions, disposals, ending
      accumulated: opening, depreciation, disposals, ending
      net book value: opening, ending
  - n: 2
    action: |
      Cost roll: opening cost + period additions - period disposals
      = ending cost. Verify the math row-by-row.
    expected: |
      Each category row balances to the cent.
  - n: 3
    action: |
      Sum period additions. Compare to capex activity (P3-ASSET-COMM
      events) for the period.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Period depreciation column equals current-period depreciation
      from RPT-DEPSCH-001.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Ending net book value = opening NBV + additions - disposals -
      depreciation. Confirm.
    expected: |
      Match within $0.01.
expected_overall: |
  Roll-forward arithmetic holds and each activity column ties to
  underlying transactions.
pass_criteria: |
  All three columns (cost, accumulated, NBV) reconcile within
  $0.01 AND additions and depreciation tie to source activity.
why_this_matters: |
  This report is the auditor's fixed-asset workpaper. Reconciliation
  failures here cause restatements; getting it right monthly avoids
  year-end fire drills.
est_minutes: 15
```
