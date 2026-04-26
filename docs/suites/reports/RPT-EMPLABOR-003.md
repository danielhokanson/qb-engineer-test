## RPT-EMPLABOR-003 — Employee labor distribution by work center

```yaml
id: RPT-EMPLABOR-003
title: Employee labor distribution broken down by work center reconciles to per-WC clocking
goal: |
  Run the employee labor distribution report broken down by work
  center. Verify each (employee, work center) cell equals the sum
  of that employee's labor entries at that work center.
roles:
  - Production Manager
  - HR
preconditions:
  - At least one employee has logged labor at two or more distinct
    work centers (P4-LABOR with multiple WO/op entries).
prerequisite_cases:
  - P4-LABOR
  - RPT-EMPLABOR-001
steps:
  - n: 1
    action: |
      Run the labor distribution by work center.
    expected: |
      Report shows employee × work center matrix or grouped detail.
  - n: 2
    action: |
      Pick one employee. For each work center where they logged
      time, sum the hours. Compare to the cell.
    expected: |
      Match within 0.01 hours per cell.
  - n: 3
    action: |
      Sum that employee's row across all work centers. Compare to
      their total hours (from RPT-EMPLABOR-001).
    expected: |
      Match within 0.01 hours.
  - n: 4
    action: |
      Confirm a work center the employee never clocked at shows
      zero (or no row), not phantom hours.
    expected: |
      No phantom hours.
expected_overall: |
  Per-WC employee labor reconciles cell-by-cell and rows sum to
  total hours.
pass_criteria: |
  Each cell matches hand-summed labor entries within 0.01 hours
  AND row sum matches total hours within 0.01.
est_minutes: 10
```
