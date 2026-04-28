## RPT-SALESPROD-004 — Top-N (or "ABC") sales-by-product picks the right leaders

```yaml
id: RPT-SALESPROD-004
title: Top-N sales-by-product reflects actual revenue ranking
goal: |
  Run the sales-by-product report sorted by revenue descending and
  limited to top 10 (or top N). Verify the listed parts are the
  actual top revenue earners and that #11+ parts are correctly
  excluded.
roles:
  - Sales / Account Manager
  - Controller
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-O2C-INVOICE
preconditions:
  - At least 12 parts have revenue in the period (so a top-10
    cutoff is meaningful).
prerequisite_cases:
  - P4-INV-001
  - RPT-SALESPROD-001
steps:
  - n: 1
    action: |
      Run the sales-by-product report unfiltered, sorted by revenue
      descending. Note the top 10 parts and their revenue.
    expected: |
      Top 10 list available.
  - n: 2
    action: |
      Run the report with "top 10" or limit-10 applied. Compare the
      list and per-row revenue.
    expected: |
      Same 10 parts, same revenue per row.
  - n: 3
    action: |
      Confirm the part ranked #11 in the unfiltered report does
      NOT appear in the top-10 view.
    expected: |
      Excluded.
  - n: 4
    action: |
      Verify the sort is strictly descending (no ties causing
      drop-outs).
    expected: |
      Order matches the ranked unfiltered list.
expected_overall: |
  Top-N filter is a clean ranking with the correct cutoff.
pass_criteria: |
  Listed top-10 matches the unfiltered top-10 exactly AND #11 is
  excluded AND ordering is descending by revenue.
est_minutes: 6
```
