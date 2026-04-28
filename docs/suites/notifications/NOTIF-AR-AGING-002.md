## NOTIF-AR-AGING-002 — AR aging trigger across deeper buckets (60-90, 90+)

```yaml
id: NOTIF-AR-AGING-002
title: AR aging fires fresh notifications at each bucket transition (60-90, 90+)
goal: |
  Verify that an unpaid invoice triggers a separate notification each
  time it crosses into a deeper aging bucket (31-60, 61-90, 90+), and
  that each escalation includes the appropriate recipients (e.g., 90+
  copies the controller and credit officer).
roles:
  - Controller
  - Sales / Account Manager
  - Credit Officer
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-O2C-COLLECTIONS
preconditions:
  - An unpaid customer invoice exists, old enough to walk through
    multiple buckets via backdating.
prerequisite_cases:
  - P4-INV-001
  - NOTIF-AR-AGING-001
steps:
  - n: 1
    action: |
      Backdate the invoice into the 31-60 bucket.
    expected: |
      A notification fires to collections / account manager.
  - n: 2
    action: |
      Backdate further into the 61-90 bucket.
    expected: |
      A new notification fires; recipient list expands per policy.
  - n: 3
    action: |
      Backdate into the 90+ bucket.
    expected: |
      A new notification fires; controller and credit officer are
      included.
  - n: 4
    action: |
      Receive payment in full.
    expected: |
      Active alerts clear across all buckets.
expected_overall: |
  Each bucket transition produces a fresh, correctly-routed alert.
pass_criteria: |
  Each transition fires once AND recipients widen per policy AND payment
  clears all alerts.
est_minutes: 9
```
