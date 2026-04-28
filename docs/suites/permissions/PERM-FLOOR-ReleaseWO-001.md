## PERM-FLOOR-ReleaseWO-001 — Floor Operator cannot release a work order

```yaml
id: PERM-FLOOR-ReleaseWO-001
title: Floor Operator is denied releasing a work order
goal: |
  Verify the Floor Operator role can start and complete a WO that has
  already been released, but cannot release a new WO themselves.
roles:
  - Floor Operator
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists.
  - At least one planned (un-released) work order exists.
steps:
  - n: 1
    action: |
      Sign in as the Floor Operator. Find a planned WO (or attempt to
      reach the planning view).
    expected: |
      Either the planned WO is not visible at all, or it is visible
      read-only with no release action enabled.
  - n: 2
    action: |
      If a release URL or action is reachable, attempt it.
    expected: |
      The action is rejected with a clear authorization error. WO
      remains in Planned.
expected_overall: |
  Floor Operator cannot release a WO.
pass_criteria: |
  No WO released by the Floor Operator AND release action is not
  enabled or is rejected.
est_minutes: 4
```
