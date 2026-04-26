## PERM-PRODPLAN-ReleaseWO-001 — Production Planner can release a work order

```yaml
id: PERM-PRODPLAN-ReleaseWO-001
title: Production Planner is allowed to release a work order
goal: |
  Verify a Production Planner can release a planned WO to the floor
  and that the release records cleanly with pinned BOM and routing
  revisions.
roles:
  - Production Planner
preconditions:
  - A Production Planner user exists.
  - At least one planned (un-released) work order exists.
steps:
  - n: 1
    action: |
      Sign in as Production Planner. Find a planned WO.
    expected: |
      The WO is visible. The release action is enabled.
  - n: 2
    action: |
      Release the WO.
    expected: |
      WO transitions to Released. It appears on the floor's queue.
  - n: 3
    action: |
      Open the WO history or audit log.
    expected: |
      Release records the user, timestamp, and the BOM / routing
      revisions in effect at release.
expected_overall: |
  Production Planner releases a WO; release is auditable with pinned
  revisions.
pass_criteria: |
  WO released AND audit log captures user, timestamp, and revisions.
est_minutes: 5
```
