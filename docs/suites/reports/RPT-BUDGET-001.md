## RPT-BUDGET-001 — Budget vs. actual P&L ties actuals to postings and variance to (actual - budget)

```yaml
id: RPT-BUDGET-001
title: Budget-vs-actual P&L reconciles actuals to postings and variance is computed correctly
goal: |
  Run the budget vs. actual P&L for the closed period. Verify the
  actual column ties to the regular P&L (RPT-PNL-001), the budget
  column ties to the loaded budget, and the variance column equals
  (actual - budget) line by line.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
preconditions:
  - A budget has been loaded for the period across all P&L lines.
  - The period has been closed and the regular P&L is runnable.
prerequisite_cases:
  - P5-CLOSE-004
  - RPT-PNL-001
steps:
  - n: 1
    action: |
      Run budget vs. actual P&L for the period.
    expected: |
      Report shows budget, actual, variance, and (often) variance %
      per P&L line.
  - n: 2
    action: |
      Compare actual revenue and expense lines to RPT-PNL-001.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Compare budget revenue and expense lines to the loaded
      budget detail.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      For each line, compute (actual - budget). Compare to the
      variance column.
    expected: |
      Match within $0.01 line-by-line.
  - n: 5
    action: |
      Variance % = variance / budget × 100 (per the documented
      formula, handling budget = 0). Spot-check one row.
    expected: |
      Match within 0.1 pp.
expected_overall: |
  Actual ties to P&L, budget ties to loaded budget, variance is
  arithmetically correct.
pass_criteria: |
  Actual column ties to RPT-PNL-001 within $0.01 AND budget column
  ties to loaded budget within $0.01 AND variance = actual - budget
  within $0.01 line-by-line.
why_this_matters: |
  Department managers and the CFO live in this report. Reconciling
  actuals to the P&L every period catches mapping errors before
  they propagate to the board pack.
est_minutes: 12
```
