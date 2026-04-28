## LIST-VENDOR-001 — Vendor list UX

```yaml
id: LIST-VENDOR-001
title: Vendor list supports search, filter (1099, currency), sort, and paginate
goal: |
  Verify the vendor list view supports the same canonical UX
  (search / filter / sort / paginate) and adds vendor-specific
  filters: 1099 eligibility, currency.
roles:
  - Procurement
  - Controller
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 20 vendors exist with mixed 1099 status and at least
    two currencies.
prerequisite_cases:
  - P2-VENDOR-005
steps:
  - n: 1
    action: |
      Open the vendor list. Filter to 1099-eligible only.
    expected: |
      Result is the vendors flagged 1099-eligible.
  - n: 2
    action: |
      Add a second filter: currency = JPY.
    expected: |
      Result is the intersection.
  - n: 3
    action: |
      Sort by total YTD spend (descending) if available.
    expected: |
      Sort applied.
  - n: 4
    action: |
      Search for partial vendor name. Verify case-insensitive partial
      match.
    expected: |
      Partial match works.
expected_overall: |
  Vendor list supports vendor-specific filters cleanly.
pass_criteria: |
  All filters / sort / search behave correctly.
est_minutes: 6
```
