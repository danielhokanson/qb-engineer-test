## PERM-PROCUREMENT-ReleaseWO-001 — Procurement cannot release a work order

```yaml
id: PERM-PROCUREMENT-ReleaseWO-001
title: Procurement is denied releasing a work order
goal: |
  Verify a Procurement user cannot release work orders. They source
  materials in support of WOs but the release decision belongs to
  Production.
roles:
  - Procurement
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one planned (un-released) work order exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Find a planned WO (read-only access for
      material visibility is acceptable).
    expected: |
      Either the planned WO is not visible, or it is visible read-only
      with no release action enabled.
  - n: 2
    action: |
      If a release URL or action is reachable, attempt it.
    expected: |
      The action is rejected with an authorization error. WO remains
      Planned.
  - n: 3
    action: |
      If an API is exposed, attempt the release-WO call.
    expected: |
      The request is rejected.
expected_overall: |
  Procurement cannot release a WO.
pass_criteria: |
  No WO released AND release action not enabled or rejected AND API
  rejects the request.
est_minutes: 4
```
