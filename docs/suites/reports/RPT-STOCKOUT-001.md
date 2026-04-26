## RPT-STOCKOUT-001 — Stockout / backorder report flags unfulfilled SO demand

```yaml
id: RPT-STOCKOUT-001
title: Stockout / backorder report lists unfulfilled SO demand and ties to open backorder lines
goal: |
  Run the stockout / backorder report. Verify it lists every SO
  line that could not be fulfilled from on-hand stock as of the
  report date, with shortage qty and required date matching the
  SO and inventory state.
roles:
  - Warehouse / Logistics
  - Sales / Account Manager
preconditions:
  - At least one SO has a line whose qty exceeds on-hand at the
    fulfilling location (a backorder).
  - At least one SO line has been fully fulfilled (should NOT
    appear in the report).
prerequisite_cases:
  - P3-RESERVE-001
  - P4-SHIP-SPLIT-001
steps:
  - n: 1
    action: |
      Run the stockout / backorder report.
    expected: |
      Report lists SO lines with backorder qty, required date,
      and customer.
  - n: 2
    action: |
      For one SO line on the report, hand-verify: SO qty - shipped
      qty - reserved qty available = backorder qty.
    expected: |
      Match.
  - n: 3
    action: |
      Confirm a fully shipped SO line does NOT appear.
    expected: |
      Excluded.
  - n: 4
    action: |
      Confirm an SO line with stock on hand and reserved (but not
      yet shipped) does NOT appear (it's not a stockout).
    expected: |
      Excluded.
  - n: 5
    action: |
      Sort the report by required date ascending. Verify the
      earliest required-date row is the most urgent backorder.
    expected: |
      Sort order correct.
expected_overall: |
  Backorder report identifies real shortages with the right
  shortage qty and date.
pass_criteria: |
  Hand-computed shortage qty matches AND fully shipped / fully
  reserved lines are excluded AND sort by required date works.
why_this_matters: |
  Customer service uses this list to communicate delivery dates.
  False positives (saying we're short when we're not) cause lost
  sales; false negatives (missing real shortages) cause silent
  late shipments.
est_minutes: 10
```
