## AUDIT-BOM-CREATE-001 — Initial BOM creation is logged

```yaml
id: AUDIT-BOM-CREATE-001
title: Creating the first BOM for a part records actor and full structure
goal: |
  Verify that creating the initial BOM for a finished part records
  actor, timestamp, parent part, and the full set of components and
  quantities as the initial "after" state.
roles:
  - Engineer / R&D
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A finished part exists with no BOM yet.
  - At least three component parts exist.
steps:
  - n: 1
    action: |
      Open the finished part. Create a BOM with at least three component
      lines (component, quantity per, UoM each). Release the BOM.
    expected: |
      BOM is created and released.
  - n: 2
    action: |
      Open the BOM's audit log / history.
    expected: |
      Creation entry shows actor, timestamp, parent part, and the full
      list of component lines as the "after" state. No "before" state
      since the BOM did not exist previously.
expected_overall: |
  Initial BOM creation is fully attributed and structure-complete in
  the log.
pass_criteria: |
  Creation entry present AND lists every component line with its
  quantity AND captures actor and timestamp.
est_minutes: 5
```
