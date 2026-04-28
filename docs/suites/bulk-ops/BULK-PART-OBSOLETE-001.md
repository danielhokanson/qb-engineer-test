## BULK-PART-OBSOLETE-001 — Mass-mark parts as obsolete

```yaml
id: BULK-PART-OBSOLETE-001
title: Bulk-mark a set of parts as Obsolete with replacement reference
goal: |
  Verify engineering can mass-mark parts as obsolete, optionally
  pointing to a replacement part, that obsolete parts cannot be
  added to new BOMs or POs, and that on-hand inventory of obsolete
  parts is preserved (not auto-scrapped).
roles:
  - Engineering
  - Planner
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 5 active parts exist; at least 2 have on-hand
    inventory; a replacement part exists.
steps:
  - n: 1
    action: |
      Filter parts to "category = Legacy" or similar. Select 5.
      Choose mass-mark obsolete. Specify replacement part.
    expected: |
      Stage preview shows the parts being obsoleted and the
      replacement reference.
  - n: 2
    action: |
      Confirm.
    expected: |
      All selected parts marked Obsolete. Replacement reference set
      on each. Summary reports rows changed.
  - n: 3
    action: |
      Check on-hand inventory for an obsolete part. Try to add it
      to a new BOM.
    expected: |
      On-hand quantity is unchanged. New BOM rejects the obsolete
      part or surfaces the replacement instead.
expected_overall: |
  Mass-obsolete blocks future use without destroying current
  inventory.
pass_criteria: |
  Parts marked obsolete AND on-hand preserved AND new use blocked
  with replacement surfaced.
est_minutes: 7
```
