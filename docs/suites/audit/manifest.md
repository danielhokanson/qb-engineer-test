# Audit Trail Suite

Verifies that every state-changing action of consequence is recorded in the audit log with who, what, when, and the before/after state. Audit trails that look right but skip certain action classes are a compliance risk and a forensic dead-end.

## ID convention

`AUDIT-{ACTION}-NNN`. ACTION is a short capability label (e.g., `LOGIN`, `USER-CHANGE`, `PERIOD-LOCK`, `BOM-REV`, `PO-AMEND`, `PRICE-OVR`, `PERMS-CHG`, `DEACT`, `CREDIT-CHG`).

## Sequence

Audit cases are independent. Run any in any order once the underlying records exist.

```yaml
suite: audit
title: Audit log captures every consequential state change
description: |
  For each major state-changing action, verify the audit log records
  the action with actor, timestamp, target record, and before/after
  state. Tampering checks live alongside.
estimated_total_minutes: 50

cases:
  - id: AUDIT-LOGIN-001
  - id: AUDIT-USER-CHANGE-001
  - id: AUDIT-PERIOD-LOCK-001
  - id: AUDIT-BOM-REV-001
  - id: AUDIT-PO-AMEND-001
  - id: AUDIT-PRICE-OVR-001
  - id: AUDIT-PERMS-CHG-001
  - id: AUDIT-DEACT-001
  - id: AUDIT-IMMUTABLE-001

completion_criteria:
  - Every consequential state change in the cycle is captured.
  - The audit log itself cannot be edited or deleted by any non-admin
    role (verified by AUDIT-IMMUTABLE-001).
```
