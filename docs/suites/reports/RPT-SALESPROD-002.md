## RPT-SALESPROD-002 — Sales by product grouped by category ties per group

```yaml
id: RPT-SALESPROD-002
title: Sales-by-product grouped by category reconciles per category and grand total
goal: |
  Run the sales-by-product report grouped by product category.
  Verify each category's subtotal equals the sum of its parts, and
  the categories' grand total matches the ungrouped grand total.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - Parts in the invoice register fall into at least two categories
    (P2-PART-001 with category assigned).
prerequisite_cases:
  - P4-INV-001
  - RPT-SALESPROD-001
steps:
  - n: 1
    action: |
      Run sales-by-product grouped by category.
    expected: |
      Report shows category subtotals.
  - n: 2
    action: |
      Pick one category. Sum the parts within that category in the
      report's detail. Compare to the category subtotal.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Sum all category subtotals. Compare to the report's grand
      total.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Run the ungrouped sales-by-product report. Confirm the grand
      total matches.
    expected: |
      Match within $0.01.
expected_overall: |
  Category grouping reconciles bottom-up and the grand total is
  invariant under grouping.
pass_criteria: |
  Per-category subtotal matches its parts within $0.01 AND grouped
  grand total equals ungrouped grand total within $0.01.
est_minutes: 8
```
