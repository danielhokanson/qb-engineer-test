## NOTIF-LOWSTOCK-001 — Low-stock alert at reorder point

```yaml
id: NOTIF-LOWSTOCK-001
title: Low-stock alert fires when on-hand drops below reorder point
goal: |
  Verify that when on-hand for a part drops below its reorder point,
  a notification fires to the configured recipient(s), and that the
  notification clears once stock is replenished above the point.
roles:
  - Procurement
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-PLAN-SAFETYSTOCK
preconditions:
  - A part has reorder point and notification subscribers configured
    (P3-SS-001).
prerequisite_cases:
  - P3-SS-001
steps:
  - n: 1
    action: |
      Issue or adjust on-hand to drop below the reorder point.
    expected: |
      A low-stock notification fires within the documented window
      (in-app and / or email per channel config).
  - n: 2
    action: |
      Receive new stock to bring on-hand back above reorder point.
    expected: |
      The active alert clears (or a "resolved" indicator appears).
  - n: 3
    action: |
      Repeat the cycle to verify it doesn't fire-and-stick after
      multiple cycles.
    expected: |
      Each crossing fires fresh; resolved alerts don't pile up.
expected_overall: |
  Low-stock alert fires and clears predictably.
pass_criteria: |
  Alert fires on threshold breach AND clears on recovery AND no
  duplicate / stuck alerts.
est_minutes: 8
```
