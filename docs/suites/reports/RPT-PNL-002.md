## RPT-PNL-002 — P&L for an arbitrary date range ties to dated postings

```yaml
id: RPT-PNL-002
title: P&L for a custom date range ties to postings dated within that range
goal: |
  Run the P&L for a date range that does not align with the closed
  fiscal period (e.g., a single week or a partial month). Verify the
  totals reconcile to the postings whose effective dates fall within
  that exact range — no leakage in or out at the boundaries.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
preconditions:
  - At least one customer invoice and one vendor invoice have been
    posted in the closed period (P5-CLOSE-004).
  - Postings exist on multiple dates so a sub-period range is
    meaningful.
prerequisite_cases:
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Run the P&L with a custom range starting after the period's
      first posting and ending before the period's last posting.
    expected: |
      Report renders. Revenue, COGS, expense, and net income are
      shown for the chosen range only.
  - n: 2
    action: |
      Sum customer-invoice revenue dated within (and only within) the
      chosen range. Compare to the report's revenue.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Pick one invoice dated one day before the start date. Confirm
      its revenue is NOT in the report total.
    expected: |
      Excluded.
  - n: 4
    action: |
      Pick one invoice dated one day after the end date. Confirm
      its revenue is NOT in the report total.
    expected: |
      Excluded.
expected_overall: |
  P&L respects the date filter at both boundaries and totals match
  the date-filtered source sum.
pass_criteria: |
  Revenue total matches the date-filtered invoice sum within $0.01
  AND boundary postings are correctly included/excluded.
why_this_matters: |
  Off-by-one date filters are a classic reporting bug, especially at
  midnight / time-zone boundaries. A controller running ad-hoc ranges
  for a board pack must trust the filter.
est_minutes: 10
```
