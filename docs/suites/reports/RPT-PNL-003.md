## RPT-PNL-003 — P&L by department / dimension ties to tagged postings

```yaml
id: RPT-PNL-003
title: P&L filtered by department or dimension ties to dimension-tagged postings
goal: |
  Run the P&L filtered to a single department, location, or other
  GL dimension. Verify the totals equal the sum of postings tagged
  with that dimension only.
roles:
  - Controller
preconditions:
  - Postings in the closed period carry at least two distinct
    department/dimension tags (so filtering is meaningful).
  - Each tag has at least one revenue and one expense posting.
prerequisite_cases:
  - P5-CLOSE-004
  - P1-GL-001
steps:
  - n: 1
    action: |
      Run the P&L for the closed period filtered to one department
      / dimension value (e.g., "Operations" or location "Plant 1").
    expected: |
      Report renders showing only the chosen dimension's revenue,
      COGS, and expense.
  - n: 2
    action: |
      From the JE / invoice register, sum revenue postings tagged
      to that dimension. Compare to the filtered report.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Run the P&L with no dimension filter. The unfiltered total
      should equal the sum of every per-dimension P&L.
    expected: |
      Sum of dimension P&Ls = unfiltered P&L within $0.01.
  - n: 4
    action: |
      Confirm a posting tagged to a different dimension does NOT
      appear in the filtered report's revenue total.
    expected: |
      Excluded.
expected_overall: |
  Dimension-filtered P&L reconciles to dimension-tagged source
  postings and per-dimension P&Ls roll up to the consolidated total.
pass_criteria: |
  Filtered total matches dimension-tagged source within $0.01 AND
  per-dimension sum equals the consolidated P&L within $0.01.
est_minutes: 12
```
