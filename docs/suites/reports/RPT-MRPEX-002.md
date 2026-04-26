## RPT-MRPEX-002 — MRP exception filtered by buyer shows only that buyer's parts

```yaml
id: RPT-MRPEX-002
title: MRP exception filtered by buyer ties to buyer-assigned parts only
goal: |
  Run the MRP exception report filtered to a specific buyer or
  planner. Verify the report shows only parts whose default buyer
  matches and that all listed shortages reconcile to source demand.
roles:
  - Production Planner
  - Procurement
preconditions:
  - At least two parts have different default buyers configured
    (P2-PART-001 with buyer assignment).
  - Both buyers have at least one part in shortage and one part
    not in shortage.
prerequisite_cases:
  - P3-MRP-001
  - RPT-MRPEX-001
steps:
  - n: 1
    action: |
      Run the MRP exception report filtered to buyer A.
    expected: |
      Report lists only buyer-A parts that are short.
  - n: 2
    action: |
      Pick one buyer-A short part. Hand-compute the shortage
      (demand + safety stock - on-hand - on-order). Compare.
    expected: |
      Match.
  - n: 3
    action: |
      Confirm a short part assigned to buyer B does NOT appear in
      the buyer-A filter.
    expected: |
      Excluded.
  - n: 4
    action: |
      Confirm a buyer-A part that is fully covered does NOT appear
      in the filter.
    expected: |
      Excluded (the filter doesn't make non-shortages appear).
expected_overall: |
  Buyer filter correctly scopes the exception list and shortage
  computation remains accurate.
pass_criteria: |
  Buyer-A short part shortage matches hand-computation AND
  buyer-B parts and non-shortages are correctly excluded.
why_this_matters: |
  Buyers run their daily list off this filter. A buyer who sees
  parts they don't own — or misses parts they do — manages the
  wrong queue.
est_minutes: 8
```
