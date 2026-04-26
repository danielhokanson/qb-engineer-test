## RPT-SCRAPRWK-001 — Scrap and rework summary ties to WO scrap and NCR records

```yaml
id: RPT-SCRAPRWK-001
title: Scrap and rework summary reconciles to WO scrap reports and NCR detail
goal: |
  Run the scrap and rework summary for the period. Verify scrap
  quantity × cost equals the sum of WO scrap entries, and rework
  quantity × cost equals the sum of NCR rework dispositions.
roles:
  - Production Manager
  - QC Inspector
  - Controller
preconditions:
  - At least one WO recorded scrap (P4-COMP with reject qty) and
    at least one NCR was dispositioned to rework (P5-QC-NCR-001).
prerequisite_cases:
  - P4-COMP
  - P5-QC-NCR-001
steps:
  - n: 1
    action: |
      Run the scrap and rework summary for the period.
    expected: |
      Report shows scrap qty, scrap cost, rework qty, rework cost,
      and totals.
  - n: 2
    action: |
      Pull the WO scrap entries for the period. Sum (scrap qty ×
      standard cost) per WO. Compare to the report's scrap cost.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Pull NCRs dispositioned to rework. Sum (rework qty × rework
      labor cost). Compare to the report's rework cost.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Confirm the period's scrap GL postings (scrap variance
      account) tie to the report's scrap cost.
    expected: |
      Match within $0.01.
expected_overall: |
  Scrap and rework totals reconcile to the floor and quality
  records that produced them.
pass_criteria: |
  Scrap cost matches WO entries within $0.01 AND rework cost
  matches NCR dispositions within $0.01 AND scrap GL ties.
why_this_matters: |
  Scrap and rework are the headline waste KPIs. If the report
  understates them, improvement programs miss the real opportunity.
est_minutes: 12
```
