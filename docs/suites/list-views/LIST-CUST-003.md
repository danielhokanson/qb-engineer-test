## LIST-CUST-003 — Customer list: date-range filter

```yaml
id: LIST-CUST-003
title: Customer list supports date-range filter (created / last activity)
goal: |
  Verify the customer list supports date-range filtering on at least
  two date fields (created date, last activity / last order date)
  and handles open-ended ranges, single-day ranges, and inverted
  ranges sensibly.
roles:
  - Sales / Account Manager
  - Controller
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-LIST-UX
preconditions:
  - Customers exist with created dates spanning the last 24 months
    and varied last-activity dates.
steps:
  - n: 1
    action: |
      Open the customer list. Apply a date-range filter on created
      date covering the last 30 days.
    expected: |
      Only customers created in that window appear.
  - n: 2
    action: |
      Apply a single-day range (start = end) on a known busy day.
    expected: |
      Only customers created on that day appear.
  - n: 3
    action: |
      Apply an open-ended range (start only, no end).
    expected: |
      All customers created on or after the start date appear.
  - n: 4
    action: |
      Switch the filter field to last-activity date and apply a
      90-day window.
    expected: |
      Result reflects last-activity, not created date.
  - n: 5
    action: |
      Enter an inverted range (end before start).
    expected: |
      System rejects with a clear validation message, or normalizes
      the range. Either is acceptable; silent empty result is not.
expected_overall: |
  Date-range filtering is usable for typical AR / CRM workflows.
pass_criteria: |
  Each date filter scenario returns the correct set. Inverted range
  is handled with a clear signal.
est_minutes: 6
```
