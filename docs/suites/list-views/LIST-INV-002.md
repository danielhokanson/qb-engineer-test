## LIST-INV-002 — Invoice list: date-range filter

```yaml
id: LIST-INV-002
title: Invoice list supports date-range filter (invoice date / due date)
goal: |
  Verify the customer invoice list supports date-range filtering on
  invoice date and due date, and that both work cleanly with the
  status / aging filters.
roles:
  - Controller
  - AR / Collections
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-LIST-UX
preconditions:
  - Invoices exist across at least the last 12 months with varied
    invoice dates and due dates.
steps:
  - n: 1
    action: |
      Apply a date-range filter on invoice date for the last 30
      days.
    expected: |
      Only invoices issued in that window appear.
  - n: 2
    action: |
      Switch the filter to due date and apply a 30-day window
      ending today (i.e., due in last 30 days).
    expected: |
      Result reflects due date, not invoice date. Past-due invoices
      in that window appear.
  - n: 3
    action: |
      Combine due-date filter with status = Open.
    expected: |
      Result is open invoices due in that window — a typical
      collections triage view.
  - n: 4
    action: |
      Apply an open-ended start-only range on invoice date.
    expected: |
      All invoices on or after start appear.
  - n: 5
    action: |
      Enter an inverted range and confirm clear handling.
    expected: |
      System rejects with validation, or normalizes. Silent empty
      result is not acceptable.
expected_overall: |
  Date-range filtering supports AR / collections triage.
pass_criteria: |
  Each scenario returns the correct invoice subset.
est_minutes: 5
```
