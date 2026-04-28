## BULK-PART-PRICE-001 — Mass-update list prices on a filtered part set

```yaml
id: BULK-PART-PRICE-001
title: Bulk-update list prices on a filtered part set by percentage
goal: |
  Verify a pricing analyst can select a filtered set of parts and
  apply a percentage price increase in one action, with a preview
  of old vs new price per row before commit and a per-row audit
  entry after.
roles:
  - Pricing Analyst
  - Controller
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 10 active finished-good parts exist with a list price
    set on each.
steps:
  - n: 1
    action: |
      Open the parts list. Filter to "category = Finished Good"
      and select the resulting set. Choose mass-update price.
      Enter "+5 percent."
    expected: |
      Stage screen shows old price, new price, and percent delta
      per row before commit.
  - n: 2
    action: |
      Confirm.
    expected: |
      All selected parts updated. Summary reports row count and
      total dollar exposure of the change.
  - n: 3
    action: |
      Open one of the parts and review its price history or audit
      log.
    expected: |
      A single audit entry per part with prior price, new price,
      who, and when.
expected_overall: |
  Bulk price update previews before commit and audits per row.
pass_criteria: |
  Preview shown AND all rows updated AND each row audited AND no
  rows outside the filter affected.
est_minutes: 7
```
