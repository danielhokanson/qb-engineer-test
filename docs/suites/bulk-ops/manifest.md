# Bulk Operations Suite

Mass updates, mass deletes, mass status changes, mass reassigns. Real shops use these constantly: terms changes for a vendor list, closing a batch of completed WOs, reassigning a region's customers. Bulk operations are also where the worst data corruption happens — partial failures that leave records in inconsistent states.

## ID convention

`BULK-{ENTITY-OP}-NNN`.

```yaml
suite: bulk-ops
title: Bulk operations beyond import
description: |
  Mass update, mass status change, mass reassign, mass deactivate.
  Each operation must report which records succeeded, which failed,
  and why — never silent partial outcomes.
estimated_total_minutes: 40

cases:
  - id: BULK-VENDOR-TERMS-001
  - id: BULK-WO-CLOSE-001
  - id: BULK-CUST-REASSIGN-001
  - id: BULK-CUST-DEACT-001

completion_criteria:
  - Every bulk operation reports success / failure per row.
  - No partial-state corruption in any case.
```
