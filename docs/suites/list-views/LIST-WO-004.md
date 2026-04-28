## LIST-WO-004 — WO list: persisted table state per-user

```yaml
id: LIST-WO-004
title: WO list supports persisting and recalling table state per-user
goal: |
  Verify the WO list supports persisting and recalling table state
  per-user via any mechanism — either a dedicated saved-views UI
  affordance or a generic key/value preference store — for
  recurring queries (e.g., "My active WOs", "Late WOs", "Press
  Shop today"). Persistence must support save, recall, update, and
  delete against the current user.
roles:
  - Production Manager
  - Production Planner
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 WOs exist across statuses, work centers, and due
    dates.
steps:
  - n: 1
    action: |
      Configure: filter to status = In-progress + work center =
      Press Shop, sort by due date ascending.
    expected: |
      List reflects the configuration.
  - n: 2
    action: |
      Persist the configuration under a name / identifier (e.g.,
      "Press Shop active") via whatever mechanism the application
      provides — dedicated saved-views menu, or a generic
      user-preferences key/value entry (e.g., POST to
      /user-preferences).
    expected: |
      Configuration is stored against the current user. If a
      saved-views UI exists, the entry appears in the menu;
      otherwise the preference persists in the underlying store.
  - n: 3
    action: |
      Switch to a default list view, then recall the persisted
      configuration via the same mechanism used in step 2.
    expected: |
      Recalled configuration restores the exact filter / sort.
  - n: 4
    action: |
      Update the persisted configuration: change one filter and
      save in place under the same identifier.
    expected: |
      Stored configuration updates.
  - n: 5
    action: |
      Delete the persisted configuration.
    expected: |
      Entry removed from the persistence layer (menu or key/value
      store). Default list unaffected.
expected_overall: |
  Persisted table state supports recurring production-floor
  workflows regardless of whether the application surfaces it as
  a first-class saved-views UI or as a generic user-preferences
  key/value store.
pass_criteria: |
  Persist, recall, update, and delete of table state all work
  cleanly. Either a dedicated UI affordance OR a generic key/value
  preference store satisfies this requirement.
notes: |
  Reconciled in Phase 2 — when the application develops a
  dedicated saved-views UI, this case will tighten to require
  that surface.
est_minutes: 5
```
