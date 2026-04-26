## CONC-OPTIMISTIC-LOCK-001 — Stale-data save is detected and surfaced

```yaml
id: CONC-OPTIMISTIC-LOCK-001
title: Saving an edited record from a stale view is rejected with a recoverable error
goal: |
  Verify that if User A loads a record, User B updates it and saves,
  and then User A tries to save their stale copy, User A's save is
  rejected with an error that explains the record changed and offers
  a way to reload and reapply.
roles:
  - Administrator
  - Sales / Account Manager
preconditions:
  - At least one record (a customer or part is fine) is editable by
    both users.
steps:
  - n: 1
    action: |
      User A: open the record. Begin editing a field but do not save.
    expected: |
      Form open with stale snapshot in memory.
  - n: 2
    action: |
      User B: in a separate session, open and save a change to the
      same record.
    expected: |
      User B's save succeeds.
  - n: 3
    action: |
      User A: complete the edit and click save.
    expected: |
      Save is rejected with a clear, plain-English message: the
      record was updated by another user since A loaded it. The
      message includes either a "reload and reapply" affordance or
      a way to view the conflict.
  - n: 4
    action: |
      User A: reload. Reapply A's edit. Save again.
    expected: |
      Save succeeds against the fresh version.
expected_overall: |
  Optimistic locking is in place; stale saves are visible.
pass_criteria: |
  Stale save was rejected AND the message explained why AND a
  recovery path was offered.
why_this_matters: |
  Without optimistic locking, the easiest concurrency bug — User A
  loads, User B saves, User A saves over B — destroys data silently.
est_minutes: 7
```
