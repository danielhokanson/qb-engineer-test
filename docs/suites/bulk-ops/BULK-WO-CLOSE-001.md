## BULK-WO-CLOSE-001 — Bulk-close completed WOs after period end

```yaml
id: BULK-WO-CLOSE-001
title: Bulk-close work orders that have completed all operations
goal: |
  Verify production management can mass-close a list of completed-
  but-not-closed WOs, the operation reports per-WO outcome, and any
  WOs that fail to close (e.g., variance reason missing) are flagged
  rather than silently skipped.
roles:
  - Production Manager
capabilities:
  - CAP-MFG-COMPLETE
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 5 WOs exist with all operations complete.
  - At least one of them has a missing variance reason that should
    block close (per P4-WOVAR-001).
prerequisite_cases:
  - P4-COMP-FINAL
  - P4-WOVAR-001
steps:
  - n: 1
    action: |
      Filter the WO list to "completed, not closed." Select all.
      Choose bulk-close.
    expected: |
      Action stages with a per-WO preview.
  - n: 2
    action: |
      Confirm.
    expected: |
      Result summary: 4 closed, 1 rejected with reason "Variance
      reason required." Closed WOs are marked closed; the rejected
      one remains open and surfaces what to fix.
  - n: 3
    action: |
      Fix the rejected WO's variance reason. Re-run the bulk-close
      on it alone.
    expected: |
      Now closes successfully.
expected_overall: |
  Bulk close reports per-WO outcomes and never silently fails.
pass_criteria: |
  Successful WOs closed AND failed WO flagged with reason AND no
  silent skips.
est_minutes: 8
```
