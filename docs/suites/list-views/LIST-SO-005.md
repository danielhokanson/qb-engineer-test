## LIST-SO-005 — Sales order list: multi-column sort + persisted table state

```yaml
id: LIST-SO-005
title: SO list supports multi-column sort and persisting / recalling table state per-user
goal: |
  Verify the SO list supports stable multi-column sort and persisting
  / recalling table state (filter / sort / column set) per-user via
  any mechanism — either a dedicated saved-views UI affordance or a
  generic key/value preference store.
roles:
  - Sales / Account Manager
  - Customer Service
preconditions:
  - At least 50 SOs exist across customers, statuses, and dates.
steps:
  - n: 1
    action: |
      Sort by promised ship date (ascending) primary, then by
      customer (ascending) secondary, then by total amount
      (descending) tertiary.
    expected: |
      Sort precedence reflected; sort indicator shows three-level
      precedence; ties break correctly.
  - n: 2
    action: |
      Apply filter: status = Open. Hide one column.
    expected: |
      List reflects all settings.
  - n: 3
    action: |
      Persist the configuration under a name / identifier (e.g.,
      "Open SOs by ship date") via whatever mechanism the application
      provides — dedicated saved-views menu, or a generic
      user-preferences key/value entry (e.g., POST to
      /user-preferences).
    expected: |
      Configuration is stored against the current user. If a
      saved-views UI exists, the entry appears in the menu;
      otherwise the preference persists in the underlying store.
  - n: 4
    action: |
      Switch to a different list configuration, then recall the
      persisted configuration via the same mechanism used in step 3.
    expected: |
      Recalled configuration restores the exact filter / sort /
      column set.
  - n: 5
    action: |
      Delete the persisted configuration.
    expected: |
      Entry removed from the persistence layer (menu or key/value
      store).
expected_overall: |
  Multi-column sort and persisted table state together support
  recurring customer-service / sales workflows regardless of whether
  the application surfaces persistence as a first-class saved-views UI
  or as a generic user-preferences key/value store.
pass_criteria: |
  Sort precedence works cleanly AND persist / recall / delete of table
  state all work cleanly. Either a dedicated UI affordance OR a generic
  key/value preference store satisfies the persistence requirement.
notes: |
  Reconciled in Phase 2 — when the application develops a
  dedicated saved-views UI, this case will tighten to require
  that surface.
est_minutes: 6
```
