## RPT-VENDORPERF-003 — Vendor performance grouped by category

```yaml
id: RPT-VENDORPERF-003
title: Vendor performance grouped by commodity category aggregates correctly
goal: |
  Run the vendor performance report grouped by vendor commodity /
  category. Verify the per-category averages reflect only vendors
  in that category and that per-vendor numbers don't double-count
  across categories.
roles:
  - Procurement
preconditions:
  - At least two vendor categories (e.g., "Steel," "Electronics")
    each have multiple vendors with receipt history.
prerequisite_cases:
  - P3-RECV-001
  - RPT-VENDORPERF-001
steps:
  - n: 1
    action: |
      Run vendor performance grouped by category.
    expected: |
      Report shows category headers with aggregated metrics.
  - n: 2
    action: |
      For one category, list the vendors in it. Compute the
      receipt-weighted average on-time %.
    expected: |
      Compute.
  - n: 3
    action: |
      Compare to the report's category aggregate.
    expected: |
      Match within rounding.
  - n: 4
    action: |
      Confirm a vendor in a different category is NOT included in
      the first category's aggregate.
    expected: |
      Excluded.
expected_overall: |
  Category grouping aggregates only the right vendors and metrics
  reconcile to a hand-weighted average.
pass_criteria: |
  Category aggregate matches receipt-weighted average within
  rounding AND no cross-category leakage.
est_minutes: 10
```
