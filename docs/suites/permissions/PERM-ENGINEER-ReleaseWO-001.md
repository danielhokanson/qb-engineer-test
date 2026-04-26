## PERM-ENGINEER-ReleaseWO-001 — Engineer cannot release a work order

```yaml
id: PERM-ENGINEER-ReleaseWO-001
title: Engineer / R&D is denied releasing a work order
goal: |
  Verify an Engineer / R&D user cannot release work orders. They own
  the BOM and routing the WO is built against, but the release
  decision is a production-control function.
roles:
  - Engineer / R&D
preconditions:
  - An Engineer user exists with no other roles attached.
  - At least one planned (un-released) work order exists.
steps:
  - n: 1
    action: |
      Sign in as Engineer. Find a planned WO.
    expected: |
      The WO is visible read-only with no release action enabled, or
      not visible at all.
  - n: 2
    action: |
      If a release URL is reachable, attempt it.
    expected: |
      The action is rejected with an authorization error.
  - n: 3
    action: |
      If an API is exposed, attempt the release-WO call.
    expected: |
      The request is rejected.
expected_overall: |
  Engineer cannot release a WO.
pass_criteria: |
  No WO released AND release action not enabled or rejected AND API
  rejects the request.
est_minutes: 4
```
