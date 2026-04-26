## RPT-INVVAL-002 — Inventory valuation by location ties to per-location bin totals

```yaml
id: RPT-INVVAL-002
title: Inventory valuation filtered by location reconciles to bin-level inventory
goal: |
  Run the inventory valuation report filtered to a single location
  (warehouse or plant). Verify the per-location total equals the sum
  of bin-level on-hand × cost at that location, and that all
  per-location totals roll up to the consolidated valuation.
roles:
  - Controller
  - Warehouse / Logistics
preconditions:
  - Inventory exists at two or more distinct locations / warehouses.
  - At least one part is stocked at multiple locations to verify the
    location filter splits the part correctly.
prerequisite_cases:
  - P1-LOC-001
  - RPT-INVVAL-001
steps:
  - n: 1
    action: |
      Run the inventory valuation filtered to location A.
    expected: |
      Report shows only parts/qty at location A with extended values.
  - n: 2
    action: |
      For one bin in location A, sum (bin qty × unit cost). Compare
      to the report's part row at location A.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Run the report filtered to location B. Sum its grand total.
    expected: |
      Available.
  - n: 4
    action: |
      Sum (location A grand total + location B grand total + any
      other locations). Compare to the unfiltered consolidated
      valuation.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Pick a part stocked at multiple locations. Confirm the per-
      location quantities sum to the consolidated quantity.
    expected: |
      Match exactly (no rounding on quantity).
expected_overall: |
  Per-location valuation reconciles to bin-level detail and rolls
  up cleanly to the consolidated total.
pass_criteria: |
  Bin-level spot check matches within $0.01 AND per-location sum
  equals consolidated within $0.01 AND multi-location part qty
  reconciles exactly.
est_minutes: 10
```
