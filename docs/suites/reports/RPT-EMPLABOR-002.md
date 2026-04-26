## RPT-EMPLABOR-002 — Employee labor distribution grouped by department

```yaml
id: RPT-EMPLABOR-002
title: Employee labor distribution grouped by department aggregates correctly
goal: |
  Run the employee labor distribution report grouped by department.
  Verify each department's hours equal the sum of its employees'
  hours, and per-department totals roll up to the consolidated.
roles:
  - HR
  - Production Manager
preconditions:
  - Employees in at least two departments have recorded labor in
    the period.
prerequisite_cases:
  - P4-LABOR
  - P1-EMP-001
  - RPT-EMPLABOR-001
steps:
  - n: 1
    action: |
      Run the labor distribution report grouped by department.
    expected: |
      Report shows department subtotals.
  - n: 2
    action: |
      For one department, sum each member employee's total hours
      from the per-employee detail. Compare to the department
      subtotal.
    expected: |
      Match within 0.01 hours.
  - n: 3
    action: |
      Sum all department subtotals. Compare to the unfiltered
      consolidated.
    expected: |
      Match within 0.01 hours.
  - n: 4
    action: |
      Confirm an employee assigned to a different department does
      NOT appear under the first department.
    expected: |
      Correct attribution.
expected_overall: |
  Department grouping reflects employee-to-department mapping and
  totals reconcile.
pass_criteria: |
  Per-department subtotal matches employee-detail sum within 0.01
  hours AND consolidated equals sum of departments within 0.01.
est_minutes: 8
```
