## RPT-EMPLABOR-001 — Employee labor distribution ties to labor postings

```yaml
id: RPT-EMPLABOR-001
title: Employee labor distribution reconciles to labor postings on WOs
goal: |
  Run the employee labor distribution report and verify each
  employee's total hours equal the sum of their WO labor entries
  for the period.
roles:
  - HR
  - Production Manager
  - Controller
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-MFG-LABOR
preconditions:
  - At least one employee has recorded labor against WOs in the period
    (P4-LABOR).
prerequisite_cases:
  - P4-LABOR
steps:
  - n: 1
    action: |
      Run the employee labor distribution report for the period.
    expected: |
      Report shows per employee: direct hours, indirect hours, total
      hours, possibly broken down by work center or WO.
  - n: 2
    action: |
      Pick one employee. Pull their labor entries for the period.
      Sum the hours.
    expected: |
      Total available.
  - n: 3
    action: |
      Compare to the report's row for that employee.
    expected: |
      Match within 0.01 hours.
  - n: 4
    action: |
      Spot-check the breakdown: at least one direct-labor entry on a
      WO and (if any) one indirect-labor / stoppage entry should both
      appear in the right buckets.
    expected: |
      Categorization is correct.
expected_overall: |
  Employee labor distribution ties to underlying labor entries.
pass_criteria: |
  Per-employee totals match labor entry sum within 0.01 hours AND
  direct/indirect categorization is correct.
est_minutes: 8
```
