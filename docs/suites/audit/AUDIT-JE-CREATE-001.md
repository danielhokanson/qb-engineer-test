## AUDIT-JE-CREATE-001 — Manual journal entry creation is logged

```yaml
id: AUDIT-JE-CREATE-001
title: Creating a draft manual JE records actor and full line detail
goal: |
  Verify that creating a draft manual journal entry records actor,
  timestamp, JE number, and the full set of debit / credit lines as
  the initial state.
roles:
  - Controller
  - GL Accountant
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A user with permission to create journal entries exists.
  - At least two posting GL accounts exist.
steps:
  - n: 1
    action: |
      Create a draft manual JE with at least one debit and one credit
      line that balance. Save as draft (do not post).
    expected: |
      Draft JE saves.
  - n: 2
    action: |
      Open the JE's audit log.
    expected: |
      Creation entry shows actor, timestamp, JE number, and the full
      line detail (account, debit, credit, memo) as the "after" state.
expected_overall: |
  Draft JE creation is fully attributed even before posting.
pass_criteria: |
  Creation entry present AND captures full line detail AND attribution.
est_minutes: 4
```
