## RPT-APAGE-003 — AP aging by GL expense category

```yaml
id: RPT-APAGE-003
title: AP aging grouped by GL expense category reconciles per category
goal: |
  Run the AP aging grouped by GL expense / cost category. Verify
  each category subtotal equals the sum of open vendor invoices
  coded to GL accounts in that category, and category sums roll up
  to the AP control balance.
roles:
  - Controller
preconditions:
  - Open vendor invoices span at least two distinct GL expense
    categories (e.g., "Materials" and "Operating Expenses").
prerequisite_cases:
  - P3-AP-001
  - RPT-APAGE-001
steps:
  - n: 1
    action: |
      Run AP aging grouped by GL category.
    expected: |
      Report shows per-category subtotals.
  - n: 2
    action: |
      For one category, sum the open vendor-invoice balances coded
      to GL accounts in it. Compare to the subtotal.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Sum all category subtotals. Compare to AP control balance.
    expected: |
      Match within $0.01.
expected_overall: |
  Per-category aging reconciles and rolls up to AP.
pass_criteria: |
  Category subtotal matches hand sum within $0.01 AND sum of
  categories equals AP control within $0.01.
est_minutes: 8
```
