## LIST-VENDOR-003 — Vendor list: date-range filter

```yaml
id: LIST-VENDOR-003
title: Vendor list supports date-range filter (last PO / onboarded)
goal: |
  Verify the vendor list supports date-range filtering on at least
  two date fields (vendor onboarded date, last PO date) and produces
  a defensible result for procurement triage.
roles:
  - Procurement
  - Controller
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-LIST-UX
preconditions:
  - Vendors exist with onboarded dates and last-PO dates spanning
    at least the last 24 months.
steps:
  - n: 1
    action: |
      Open the vendor list. Apply a date-range filter on
      onboarded-date covering the last 12 months.
    expected: |
      Only vendors onboarded in that window appear.
  - n: 2
    action: |
      Switch the filter field to last-PO-date and apply a 90-day
      window.
    expected: |
      Result is the set of vendors with at least one PO in that
      window. Vendors with no recent PO are excluded.
  - n: 3
    action: |
      Combine the date filter with status = Active.
    expected: |
      Result is the intersection.
  - n: 4
    action: |
      Apply an open-ended range (start only). Then clear the filter.
    expected: |
      Open-ended filter works. Clearing returns to the full list.
expected_overall: |
  Date-range filtering supports common vendor-management triage
  questions.
pass_criteria: |
  Each date scenario returns the correct vendor subset.
est_minutes: 5
```
