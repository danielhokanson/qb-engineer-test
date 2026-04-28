## NOTIF-LOWSTOCK-003 — Low-stock alert per location, not aggregate

```yaml
id: NOTIF-LOWSTOCK-003
title: Low-stock alert fires per location when a multi-location part dips at one site
goal: |
  Verify that for a part stocked at multiple locations with per-location
  reorder points, an alert fires for the specific location that breaches
  — not aggregated across the network — and the alert names the location.
roles:
  - Procurement
  - Warehouse Lead
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-PLAN-SAFETYSTOCK
  - CAP-INV-MULTILOC
preconditions:
  - A part is stocked at two or more locations, each with its own
    reorder point and subscriber list.
prerequisite_cases:
  - P3-SS-001
  - NOTIF-LOWSTOCK-001
steps:
  - n: 1
    action: |
      Drop on-hand at Location A below A's reorder point while
      Location B remains well above its point.
    expected: |
      A low-stock alert fires naming Location A. No alert for Location B.
  - n: 2
    action: |
      Open the alert and confirm the location, on-hand, and reorder
      point shown.
    expected: |
      Location, on-hand, and reorder point match Location A's actuals.
  - n: 3
    action: |
      Replenish Location A above its point. Then drop Location B below
      its point.
    expected: |
      Location A alert clears. A new alert fires naming Location B.
expected_overall: |
  Alerts are scoped to the specific location that breached.
pass_criteria: |
  Each alert names the correct location AND does not fire for unaffected
  locations AND clears independently per location.
est_minutes: 8
```
