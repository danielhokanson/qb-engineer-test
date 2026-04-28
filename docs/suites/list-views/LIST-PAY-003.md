## LIST-PAY-003 — Payment list: date-range filter

```yaml
id: LIST-PAY-003
title: Payment list supports date-range filter (posted / cleared)
goal: |
  Verify the payment list supports date-range filtering on posted
  date and cleared date, and combines cleanly with method / status
  filters.
roles:
  - AR / Collections
  - AP / Accounts Payable
  - Controller
capabilities:
  - CAP-O2C-CASH
  - CAP-CROSS-LIST-UX
preconditions:
  - Payments exist across at least the last 12 months with varied
    posted and cleared dates.
steps:
  - n: 1
    action: |
      Apply a date-range filter on posted date for the last 30 days.
    expected: |
      Only payments posted in that window appear.
  - n: 2
    action: |
      Switch the filter to cleared date for the last 7 days.
    expected: |
      Only payments cleared in the last week appear.
  - n: 3
    action: |
      Combine cleared-date filter with method = Check.
    expected: |
      Result is checks cleared in that window — a typical bank-rec
      view.
  - n: 4
    action: |
      Apply an open-ended end-only range on posted date (everything
      posted before a given date).
    expected: |
      All payments posted on or before the end date appear.
  - n: 5
    action: |
      Enter an inverted range and confirm clear handling.
    expected: |
      System rejects with validation, or normalizes. Silent empty
      result is not acceptable.
expected_overall: |
  Date-range filtering supports bank reconciliation and AR / AP
  triage.
pass_criteria: |
  Each scenario returns the correct payment subset.
est_minutes: 5
```
