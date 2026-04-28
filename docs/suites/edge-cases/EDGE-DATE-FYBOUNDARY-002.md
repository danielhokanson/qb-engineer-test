## EDGE-DATE-FYBOUNDARY-002 — Year-end accruals reverse cleanly into the new fiscal year

```yaml
id: EDGE-DATE-FYBOUNDARY-002
title: An accrual posted on the last day of the fiscal year reverses on the first day of the next
goal: |
  Verify that an auto-reversing journal entry dated December 31 posts
  to the closing year, that its reversal posts dated January 1 of the
  new year, and that both years' P&L reflect the correct net impact.
roles:
  - Controller
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-ACCT-FULLGL
  - CAP-RPT-FINANCIALS
preconditions:
  - The fiscal year starts January 1.
  - At least two open periods straddle the year-end boundary.
steps:
  - n: 1
    action: |
      Post an auto-reversing journal entry dated December 31 — accrued
      expense $1,000 (debit expense, credit accrued liability), with
      reversal date January 1.
    expected: |
      Entry posts in December. Reversal queued for January 1.
  - n: 2
    action: |
      Open the GL for January 1 of the new year.
    expected: |
      Reversal entry posted on January 1, opposite sign.
  - n: 3
    action: |
      Run the closing-year P&L.
    expected: |
      Includes the $1,000 accrued expense in the closing year. Reversal
      does NOT bleed back into the closing year.
  - n: 4
    action: |
      Run the new-year P&L year-to-date.
    expected: |
      Shows the $1,000 reversal credit in the new year and nothing from
      the original accrual line.
expected_overall: |
  The accrual lives in the closing year. The reversal lives in the new
  year. Neither leaks.
pass_criteria: |
  Original entry in closing year only AND reversal in new year only
  AND P&L impact is correct in both directions.
why_this_matters: |
  Auto-reversing entries are a routine year-end mechanism. A system
  that posts the reversal in the wrong period silently overstates one
  year and understates the next.
est_minutes: 8
```
