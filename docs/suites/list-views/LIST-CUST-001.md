## LIST-CUST-001 — Customer list: search, filter, sort, paginate

```yaml
id: LIST-CUST-001
title: Customer list supports search, filter, sort, pagination, and persisted table state
goal: |
  Verify the customer list view: partial-match search by name and ID,
  filter by status / region / credit band, sort on every column,
  pagination over a non-trivial dataset, and persisting / recalling
  table state per-user via any mechanism (either a dedicated
  saved-views UI affordance or a generic key/value preference store).
roles:
  - Sales / Account Manager
  - Administrator
preconditions:
  - At least 50 customers exist (for filter / sort / paginate
    coverage). Some active, some inactive.
steps:
  - n: 1
    action: |
      Open the customer list. Type a partial customer name (e.g.,
      "ACM") into search.
    expected: |
      Results filter live to matching customers (case-insensitive,
      partial match).
  - n: 2
    action: |
      Apply a filter: status = Inactive.
    expected: |
      Only inactive customers shown.
  - n: 3
    action: |
      Sort by name (ascending), then by created date (descending).
    expected: |
      Sort applied. Results reflect sort order.
  - n: 4
    action: |
      Paginate to last page.
    expected: |
      Last page returns the expected tail of the sorted set.
  - n: 5
    action: |
      Persist the current filter / sort under a name / identifier via
      whatever mechanism the application provides — dedicated
      saved-views menu, or a generic user-preferences key/value entry
      (e.g., POST to /user-preferences). Recall it.
    expected: |
      Configuration is stored against the current user. If a
      saved-views UI exists, the entry appears in the menu;
      otherwise the preference persists in the underlying store.
      Recalling restores filters.
expected_overall: |
  Customer list is fully usable for normal-day workflows, including
  persisted table state regardless of whether the application surfaces
  it as a first-class saved-views UI or a generic user-preferences
  key/value store.
pass_criteria: |
  Search / filter / sort / paginate all work correctly AND persist /
  recall of table state works cleanly. Either a dedicated UI affordance
  OR a generic key/value preference store satisfies the persistence
  requirement.
notes: |
  Reconciled in Phase 2 — when the application develops a
  dedicated saved-views UI, this case will tighten to require
  that surface.
est_minutes: 8
```
