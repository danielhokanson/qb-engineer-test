## RPT-CYCLECNT-001 — Cycle count history shows count results, variances, and reconciliation

```yaml
id: RPT-CYCLECNT-001
title: Cycle count history reconciles count entries to inventory adjustments
goal: |
  Run the cycle count history report for the period. Verify each
  count entry's variance equals (counted qty - system qty) at
  count time, and that approved variances tie to inventory
  adjustment postings.
roles:
  - Warehouse / Logistics
  - Controller
preconditions:
  - At least one cycle count has been performed in the period
    (P3-COUNT-001 or P5-CYCLE-001) including one with a non-zero
    variance.
prerequisite_cases:
  - P3-COUNT-001
  - P5-CYCLE-001
steps:
  - n: 1
    action: |
      Run the cycle count history report for the period.
    expected: |
      Report shows per-count entry: part, location, system qty,
      counted qty, variance qty, variance value.
  - n: 2
    action: |
      For one count with variance, hand-compute (counted - system)
      and (variance × unit cost). Compare.
    expected: |
      Match.
  - n: 3
    action: |
      Sum variance value across approved variances. Compare to
      the period's inventory adjustment postings (P5-INV-ADJ).
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Confirm a count entry with zero variance does NOT generate
      an inventory adjustment posting.
    expected: |
      Zero-variance count: no adjustment.
expected_overall: |
  Cycle count history ties to per-count variance and approved
  variances tie to GL adjustments.
pass_criteria: |
  Variance computation matches per row AND approved variance sum
  ties to inventory adjustment postings within $0.01 AND zero-
  variance counts produce no adjustment.
why_this_matters: |
  Cycle counting drives inventory accuracy. If the report doesn't
  show real variances or approved variances skip the GL,
  inventory accuracy degrades silently.
est_minutes: 10
```
