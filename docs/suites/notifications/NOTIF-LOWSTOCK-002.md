## NOTIF-LOWSTOCK-002 — Low-stock alert respects user channel preferences

```yaml
id: NOTIF-LOWSTOCK-002
title: Low-stock alert honors per-user channel preferences (in-app vs email)
goal: |
  Verify that subscribers who have disabled the email channel for
  low-stock alerts still receive the in-app notification, and that
  subscribers who have disabled in-app still receive email — neither
  channel fires for a user who has opted out of both.
roles:
  - Procurement
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-PLAN-SAFETYSTOCK
preconditions:
  - A part has reorder point and at least three subscribers configured
    with distinct channel preferences (email-only, in-app-only, both
    disabled).
prerequisite_cases:
  - P3-SS-001
  - NOTIF-LOWSTOCK-001
steps:
  - n: 1
    action: |
      Drop on-hand below reorder point.
    expected: |
      The email-only subscriber receives email and no in-app banner.
      The in-app-only subscriber sees the banner and no email.
      The fully-opted-out subscriber receives nothing on either channel.
  - n: 2
    action: |
      Toggle the opted-out subscriber's preferences to enable in-app,
      then trigger another threshold breach (recover and re-breach).
    expected: |
      That subscriber now receives the in-app alert on the next breach.
expected_overall: |
  Per-user preferences are authoritative for channel delivery.
pass_criteria: |
  Each subscriber receives only on their enabled channel(s) AND
  preference changes take effect on the next firing.
est_minutes: 7
```
