## PERM-PRODMGR-ReleaseWO-001 — Production Manager can release a work order

```yaml
id: PERM-PRODMGR-ReleaseWO-001
title: Production Manager is allowed to release a work order
goal: |
  Verify the Production Manager role can release a planned WO to the
  floor and that the release records cleanly in the audit log.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists.
  - At least one planned (un-released) work order exists.
steps:
  - n: 1
    action: |
      Sign in as the Production Manager. Find a planned WO.
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
      The release records the user, timestamp, and the BOM/routing
      revisions in effect at release.
expected_overall: |
  Production Manager releases a WO; the release is auditable with
  pinned revisions.
pass_criteria: |
  WO released AND audit log captures user, timestamp, and revisions.
est_minutes: 5
```
