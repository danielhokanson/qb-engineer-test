## LIST-PART-005 — Part list: persisted table state per-user

```yaml
id: LIST-PART-005
title: Part list supports persisting and recalling table state per-user
goal: |
  Verify the parts list supports persisting and recalling table
  state (filter / sort / column configuration) per-user via any
  mechanism — either a dedicated saved-views UI affordance or a
  generic key/value preference store. The persistence must allow
  saving a configuration under an identifier, recalling it later,
  updating it, and removing it cleanly.
roles:
  - Engineer / R&D
  - Procurement
preconditions:
  - At least 100 parts exist across multiple types and statuses.
steps:
  - n: 1
    action: |
      Configure the list: filter type = Raw material, status =
      Active, sort by part number ascending, hide cost column.
    expected: |
      List reflects the configuration.
  - n: 2
    action: |
      Persist the configuration under a name / identifier (e.g.,
      "My active raw materials") via whatever mechanism the
      application provides — dedicated saved-views menu, or a
      generic user-preferences key/value entry (e.g., POST to
      /user-preferences).
    expected: |
      Configuration is stored against the current user. If a
      saved-views UI exists, the entry appears in the menu;
      otherwise the preference persists in the underlying store.
  - n: 3
    action: |
      Switch to a different list configuration, then recall the
      persisted configuration via the same mechanism used in step 2.
    expected: |
      Recalled configuration restores the exact filter / sort /
      column set.
  - n: 4
    action: |
      Update the persisted configuration: change one filter and
      save in place under the same identifier.
    expected: |
      Stored configuration updates. Re-recalling loads the new
      config.
  - n: 5
    action: |
      Delete the persisted configuration.
    expected: |
      Entry removed from the persistence layer (menu or key/value
      store). Default list view unaffected.
expected_overall: |
  Persisted table state supports recurring engineering /
  procurement workflows regardless of whether the application
  surfaces it as a first-class saved-views UI or as a generic
  user-preferences key/value store.
pass_criteria: |
  Persist, recall, update, and delete of table state all work
  cleanly. State is scoped per-user (or per-team if shared, with
  clear ownership). Either a dedicated UI affordance OR a generic
  key/value preference store satisfies this requirement.
notes: |
  Reconciled in Phase 2 — when the application develops a
  dedicated saved-views UI, this case will tighten to require
  that surface.
est_minutes: 6
```
