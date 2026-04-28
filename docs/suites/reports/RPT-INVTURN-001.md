## RPT-INVTURN-001 — Inventory turnover ties COGS and average inventory

```yaml
id: RPT-INVTURN-001
title: Inventory turnover reconciles annualized COGS and average inventory per part
goal: |
  Run the inventory turnover report for the period. Verify per-
  part turnover = annualized COGS / average inventory value, and
  days-on-hand = 365 / turnover. Spot-check inputs against the
  P&L COGS and inventory valuation.
roles:
  - Controller
  - Warehouse / Logistics
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-RPT-INVVAL
  - CAP-INV-CORE
preconditions:
  - The closed period has COGS activity and the inventory
    valuation has been run (RPT-INVVAL-001).
prerequisite_cases:
  - P5-CLOSE-004
  - RPT-INVVAL-001
steps:
  - n: 1
    action: |
      Run the inventory turnover report for the period.
    expected: |
      Report shows per-part: COGS, average inventory, turnover,
      days on hand.
  - n: 2
    action: |
      For one part, identify period COGS (from completion or
      shipping postings) and annualize: COGS × (12 / period
      months). Compute average inventory = (opening + ending) / 2
      from inventory valuation.
    expected: |
      Computed.
  - n: 3
    action: |
      Compute turnover = annualized COGS / average inventory.
      Compare to the report.
    expected: |
      Match within 0.1 turns.
  - n: 4
    action: |
      Days on hand = 365 / turnover. Compare.
    expected: |
      Match within 1 day.
  - n: 5
    action: |
      Sum per-part annualized COGS. Compare to (P&L COGS × 12 /
      period months) total.
    expected: |
      Match within $0.01 (or document a known reconciling item).
expected_overall: |
  Per-part turnover and DOH reconcile to source COGS and
  inventory valuation.
pass_criteria: |
  Spot-checked turnover matches within 0.1 turns AND DOH within
  1 day AND total annualized COGS reconciles to P&L within
  $0.01.
why_this_matters: |
  Turnover and DOH are the headline working-capital KPIs. A wrong
  number drives wrong inventory targets and tied-up cash.
est_minutes: 12
```
