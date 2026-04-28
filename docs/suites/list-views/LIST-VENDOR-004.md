## LIST-VENDOR-004 — Vendor list: multi-column sort

```yaml
id: LIST-VENDOR-004
title: Vendor list supports stable multi-column sort
goal: |
  Verify the vendor list supports sorting on multiple columns at
  once with stable ordering, and that the sort indicator UI clearly
  shows precedence.
roles:
  - Procurement
  - Controller
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 vendors exist with overlapping values in at least
    two sortable columns (e.g., several vendors share the same
    country, several share the same currency).
steps:
  - n: 1
    action: |
      Sort by country (ascending) as the primary sort.
    expected: |
      Vendors group by country alphabetically. Sort indicator shows
      country as primary.
  - n: 2
    action: |
      Add a secondary sort: vendor name (ascending).
    expected: |
      Within each country group, vendors are alphabetized by name.
      Sort indicator shows the precedence (country, then name).
  - n: 3
    action: |
      Add a tertiary sort: created date (descending).
    expected: |
      Within each (country, name) group, ties break by created date
      newest-first. Indicator shows the three-level precedence.
  - n: 4
    action: |
      Reverse the primary sort direction (country descending).
    expected: |
      Group order flips. Secondary and tertiary sorts unchanged.
  - n: 5
    action: |
      Clear all sorts.
    expected: |
      List returns to default ordering. Sort indicators clear.
expected_overall: |
  Multi-column sort is reliable and the precedence is obvious.
pass_criteria: |
  Sort precedence is correct, stable, and visually communicated.
est_minutes: 6
```
