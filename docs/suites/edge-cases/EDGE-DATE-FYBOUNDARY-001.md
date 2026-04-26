## EDGE-DATE-FYBOUNDARY-001 — Transactions on the fiscal-year boundary post to the right year

```yaml
id: EDGE-DATE-FYBOUNDARY-001
title: Transactions dated on the last and first days of the fiscal year post to the correct year
goal: |
  Verify that transactions dated December 31 fall in the closing year
  and transactions dated January 1 fall in the new year, both for
  reporting and for the Year-To-Date calculations on every report.
roles:
  - Controller
preconditions:
  - The fiscal year starts January 1 (per P0-TENANT-004).
  - At least two open periods straddling the year-end boundary exist.
steps:
  - n: 1
    action: |
      Post a journal entry dated December 31 (last day of fiscal year)
      to a revenue account, $100.
    expected: |
      Entry posts in the December period.
  - n: 2
    action: |
      Post a journal entry dated January 1 (first day of next fiscal
      year) to the same account, $100.
    expected: |
      Entry posts in the January period of the new fiscal year.
  - n: 3
    action: |
      Run the P&L for the closing year.
    expected: |
      Includes the December 31 entry; does NOT include the January 1
      entry.
  - n: 4
    action: |
      Run the P&L for the new year, year-to-date as of January 1.
    expected: |
      Includes the January 1 entry; does NOT include the December 31
      entry.
expected_overall: |
  The fiscal-year boundary is honored cleanly. No transaction lands
  in the wrong year.
pass_criteria: |
  Each transaction appears in exactly one year's P&L AND not in the
  other.
why_this_matters: |
  Off-by-one on the year boundary mis-states annual results and
  triggers tax issues. This is among the highest-stakes edge-case
  bugs.
est_minutes: 6
```
