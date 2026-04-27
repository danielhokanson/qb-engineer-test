# Audit Trail Suite

Verifies that every state-changing action of consequence is recorded in the audit log with who, what, when, and the before/after state. Audit trails that look right but skip certain action classes are a compliance risk and a forensic dead-end.

The suite covers two distinct audit surfaces: per-entity `activity_logs` (each entity carries its own change history) and the system-wide `audit_log_entries` (cross-cutting and non-entity events: auth, role grants, period close, deactivation sweeps, bulk role assignment, audit infrastructure itself). Cases in this suite are explicit about which surface they assert against; see the glossary entries for "System-wide audit log" and "Activity log" for the per-surface breakdown.

> Reconciled in Phase 2 — explicitly references system-wide audit log per L4 polish.

## ID convention

`AUDIT-{ACTION}-NNN`. ACTION is a short capability label (e.g., `LOGIN`, `USER-CHANGE`, `PERIOD-LOCK`, `BOM-REV`, `PO-AMEND`, `PRICE-OVR`, `PERMS-CHG`, `DEACT`, `CREDIT-CHG`).

## Sequence

Audit cases are independent. Run any in any order once the underlying records exist.

```yaml
suite: audit
title: Audit log captures every consequential state change
description: |
  For each major state-changing action, verify the appropriate audit
  surface records the action with actor, timestamp, target record, and
  before/after state. Per-entity events go to `activity_logs`; non-entity
  / cross-cutting events (auth, role changes, period close, audit
  infrastructure) go to the system-wide `audit_log_entries`. Tampering
  checks live alongside.
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
  - id: AUDIT-CUST-CREATE-001
  - id: AUDIT-CUST-UPDATE-001
  - id: AUDIT-CUST-DEACT-001
  - id: AUDIT-VEND-CREATE-001
  - id: AUDIT-VEND-UPDATE-001
  - id: AUDIT-PART-CREATE-001
  - id: AUDIT-PART-UPDATE-001
  - id: AUDIT-PART-DEACT-001
  - id: AUDIT-BOM-CREATE-001
  - id: AUDIT-PO-CREATE-001
  - id: AUDIT-PO-CLOSE-001
  - id: AUDIT-PO-CANCEL-001
  - id: AUDIT-RECEIPT-001
  - id: AUDIT-SO-CREATE-001
  - id: AUDIT-SO-UPDATE-001
  - id: AUDIT-SO-CANCEL-001
  - id: AUDIT-WO-CREATE-001
  - id: AUDIT-WO-STATUS-001
  - id: AUDIT-WO-COMPLETE-001
  - id: AUDIT-INV-POST-001
  - id: AUDIT-INV-VOID-001
  - id: AUDIT-PAY-APPLY-001
  - id: AUDIT-PAY-REVERSE-001
  - id: AUDIT-EMP-CREATE-001
  - id: AUDIT-EMP-TERM-001
  - id: AUDIT-ROLE-BULK-001
  - id: AUDIT-JE-CREATE-001
  - id: AUDIT-JE-POST-001
  - id: AUDIT-JE-REVERSE-001
  - id: AUDIT-CREDIT-LIMIT-001
  - id: AUDIT-COST-CHANGE-001

completion_criteria:
  - Every consequential state change in the cycle is captured.
  - The audit log itself cannot be edited or deleted by any non-admin
    role (verified by AUDIT-IMMUTABLE-001).
```
