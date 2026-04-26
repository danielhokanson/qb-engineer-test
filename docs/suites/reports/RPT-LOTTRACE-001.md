## RPT-LOTTRACE-001 — Forward lot trace from raw lot to finished WO and shipment

```yaml
id: RPT-LOTTRACE-001
title: Forward lot trace shows full path from raw-material lot to finished goods and customer
goal: |
  Run the forward lot trace report starting from a single raw-
  material lot. Verify the report lists every WO that consumed
  that lot, every finished-good lot/serial produced from those
  WOs, and every shipment that included those finished goods.
roles:
  - QC Inspector
  - Warehouse / Logistics
preconditions:
  - A raw-material lot has been received (P3-RECV-001 with lot
    enabled) and consumed in at least one WO (P4-MATL-ISSUE).
  - That WO has completed and the finished goods have shipped
    (P4-COMP-FINAL, P4-SHIP).
prerequisite_cases:
  - P3-LOTEXP-001
  - P4-MATL-ISSUE
  - P4-COMP-FINAL
  - P4-SHIP
steps:
  - n: 1
    action: |
      Open the lot trace report and select forward direction
      starting from the raw-material lot.
    expected: |
      Report displays a tree or chain: raw lot → WOs that consumed
      it → finished lots → shipments → customers.
  - n: 2
    action: |
      Pull the raw lot's transaction history. List the WOs that
      issued from this lot. Compare to the report's WO list.
    expected: |
      Same WOs appear in the report.
  - n: 3
    action: |
      For one WO in the chain, list the finished lots / serials
      produced. Compare to the report's downstream nodes.
    expected: |
      Same finished lots appear.
  - n: 4
    action: |
      For one finished lot, identify the shipment(s) and customer.
      Compare to the report's leaf nodes.
    expected: |
      Same customer / shipment appears.
  - n: 5
    action: |
      Confirm a WO that did NOT consume this raw lot is absent.
    expected: |
      Excluded.
expected_overall: |
  Forward trace correctly chains raw lot → WOs → finished lots →
  shipments with no missing or extraneous nodes.
pass_criteria: |
  Every node in the trace matches manual trace through transaction
  history AND no unrelated WO/shipment appears.
why_this_matters: |
  Forward trace drives recall scope. Missing a downstream WO means
  customers eat the recall risk; including unrelated WOs creates
  unnecessary recall cost.
est_minutes: 15
```
