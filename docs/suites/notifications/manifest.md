# Notifications & Alerts Suite

Notifications fire under specific business conditions: a part dipping below reorder point, a PO past its expected delivery date, a PM scheduled and not started, an invoice 30 days past due, an approval waiting on someone. These accelerate workflow when they fire correctly and erode trust when they don't.

## ID convention

`NOTIF-{TRIGGER}-NNN`.

```yaml
suite: notifications
title: Notifications and alerts fire under the right conditions
description: |
  Verify each notification type fires when its trigger condition
  is met, surfaces in the right channel(s), and clears appropriately
  when the condition resolves.
estimated_total_minutes: 35

cases:
  - id: NOTIF-LOWSTOCK-001
  - id: NOTIF-PO-OVERDUE-001
  - id: NOTIF-PM-OVERDUE-001
  - id: NOTIF-AR-AGING-001
  - id: NOTIF-APPROVAL-001

completion_criteria:
  - Each notification fires under its documented trigger.
  - Each notification clears when condition resolves.
  - Channels (in-app, email) deliver as configured.
```
