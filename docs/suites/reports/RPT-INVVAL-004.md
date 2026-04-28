## RPT-INVVAL-004 — Drill-through from valuation to lot / serial detail

```yaml
id: RPT-INVVAL-004
title: Inventory valuation drill-through opens lot or serial detail
goal: |
  From the inventory valuation report, drill into a lot-tracked or
  serial-tracked part. Verify the drill lists the open lots / serials
  and their values sum to the part's row total.
roles:
  - Controller
  - Warehouse / Logistics
capabilities:
  - CAP-RPT-INVVAL
  - CAP-INV-LOTS
  - CAP-INV-SERIALS
preconditions:
  - At least one lot- or serial-tracked part has on-hand stock
    spanning two or more lots / serials.
prerequisite_cases:
  - P3-LOTEXP-001
  - RPT-INVVAL-001
steps:
  - n: 1
    action: |
      Run the inventory valuation report.
    expected: |
      Renders.
  - n: 2
    action: |
      Drill into a lot-tracked part's row.
    expected: |
      A list of open lots opens, each with qty, unit cost, and
      extended value.
  - n: 3
    action: |
      Sum the extended values across the listed lots. Compare to
      the part's row in the parent report.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Drill into one specific lot. Confirm its expiry date, source
      receipt PO, and on-hand quantity match the lot detail screen.
    expected: |
      Lot record opens with matching attributes.
expected_overall: |
  Drill-through opens correct lot / serial detail and sums roll up
  to the part row.
pass_criteria: |
  Lot list sum matches the part row within $0.01 AND the drilled-in
  lot detail shows correct attributes.
est_minutes: 8
```
