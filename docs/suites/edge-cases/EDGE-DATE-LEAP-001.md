## EDGE-DATE-LEAP-001 — February 29 is a valid transaction date

```yaml
id: EDGE-DATE-LEAP-001
title: Transactions dated February 29 in a leap year post correctly
goal: |
  Verify that February 29 is accepted as a transaction date in a leap
  year and rejected in a non-leap year, that aging from February 29
  computes correctly, and that recurring entries scheduled for "the
  29th of every month" handle non-February months.
roles:
  - Controller
capabilities:
  - CAP-O2C-INVOICE
  - CAP-O2C-COLLECTIONS
preconditions:
  - The tenant date is set to (or backdated to) a known leap year
    (e.g., 2028 or use a historical leap year if backdating works).
  - A test customer exists.
steps:
  - n: 1
    action: |
      Post an AR opening balance dated February 29 in a leap year.
    expected: |
      Date accepts. Entry posts.
  - n: 2
    action: |
      In a non-leap year context (e.g., advance the test date to
      February 29 of a non-leap year), try to enter a transaction with
      the same date.
    expected: |
      Date is rejected with a clear "not a valid date" message.
  - n: 3
    action: |
      Run AR aging on March 30 of the leap year. The Feb 29 invoice
      should be 30 days old.
    expected: |
      Age computed correctly (March 30 - February 29 = 30 days).
  - n: 4
    action: |
      If the system supports recurring JEs scheduled for "29th
      monthly" (P5-JE-002), set one up and verify how it handles
      March, April, etc.
    expected: |
      Either rolls to the 28th in non-29-bearing months OR rolls to
      the last day of the month — and the choice is documented in the
      schedule UI. Silent skipping is unacceptable.
expected_overall: |
  February 29 is valid in a leap year, invalid otherwise; aging and
  recurring schedules both handle the boundary cleanly.
pass_criteria: |
  Leap-year date accepted AND non-leap-year date rejected AND aging
  correct AND recurring rule disposition is explicit.
est_minutes: 10
```
