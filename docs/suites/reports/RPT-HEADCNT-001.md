## RPT-HEADCNT-001 — Headcount and turnover report ties to employee status changes

```yaml
id: RPT-HEADCNT-001
title: Headcount and turnover report reconciles opening, hires, terms, and ending headcount
goal: |
  Run the headcount and turnover report for the period. Verify
  opening + hires - terminations = ending headcount, and turnover
  % = terminations / average headcount over the period.
roles:
  - HR
  - Controller
preconditions:
  - At least one hire (P4-HIRE-001) and one termination
    (P5-HR-TERM-001) occurred in the period.
prerequisite_cases:
  - P4-HIRE-001
  - P5-HR-TERM-001
steps:
  - n: 1
    action: |
      Run the headcount and turnover report for the period.
    expected: |
      Report shows opening, hires, terminations, ending, and
      turnover %.
  - n: 2
    action: |
      Pull the employee register: count active as of opening date
      and as of ending date.
    expected: |
      Compare to opening and ending. Match.
  - n: 3
    action: |
      Count hires (status change to active) in the period.
      Compare.
    expected: |
      Match.
  - n: 4
    action: |
      Count terminations (status change from active) in the
      period. Compare.
    expected: |
      Match.
  - n: 5
    action: |
      Verify opening + hires - terminations = ending.
    expected: |
      Identity holds exactly.
  - n: 6
    action: |
      Turnover % = terminations / average headcount × 100, where
      average = (opening + ending) / 2 (or per the documented
      formula). Compute and compare.
    expected: |
      Match within 0.1 pp.
expected_overall: |
  Headcount roll-forward holds and turnover % reflects employee
  status changes.
pass_criteria: |
  Headcount identity holds exactly AND turnover % matches within
  0.1 pp.
why_this_matters: |
  HR uses this for board reporting and budgeting. A miscount
  hides retention problems and budget pressures.
est_minutes: 10
```
