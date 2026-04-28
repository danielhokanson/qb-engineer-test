## RPT-PNL-005 — Comparative P&L (current vs. prior period) ties out

```yaml
id: RPT-PNL-005
title: Comparative P&L (current vs. prior period) reconciles each column
goal: |
  Run the P&L in comparative mode showing current period vs. prior
  period. Verify each column independently ties to its underlying
  postings, and the variance column equals (current - prior) line by
  line.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
  - CAP-ACCT-PERIOD
preconditions:
  - At least two consecutive fiscal periods have been closed
    (P5-CLOSE-004 has run twice for sequential periods).
  - Both periods have revenue, COGS, and expense postings.
prerequisite_cases:
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Run the comparative P&L (current period vs. prior period).
    expected: |
      Report renders with current, prior, and variance columns.
  - n: 2
    action: |
      Sum revenue postings in the current period only. Compare to
      the current column's revenue.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Sum revenue postings in the prior period only. Compare to the
      prior column's revenue.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      For each line, compute (current - prior). Compare to the
      report's variance column.
    expected: |
      Match within $0.01 line-by-line.
  - n: 5
    action: |
      Confirm that postings dated in the period before "prior" do
      NOT bleed into the prior column.
    expected: |
      Excluded.
expected_overall: |
  Both columns tie to their period-bounded postings and the variance
  is computed correctly line-by-line.
pass_criteria: |
  Both columns reconcile within $0.01 AND every variance row equals
  current - prior within $0.01.
est_minutes: 12
```
