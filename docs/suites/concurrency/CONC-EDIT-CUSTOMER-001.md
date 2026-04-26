## CONC-EDIT-CUSTOMER-001 — Two users editing the same customer detect the conflict

```yaml
id: CONC-EDIT-CUSTOMER-001
title: Two users editing the same customer surfaces a conflict before silent overwrite
goal: |
  Verify that when two users open the same customer record, edit
  different fields, and save, the second save either merges or
  surfaces a conflict — it does NOT silently overwrite the first
  user's change.
roles:
  - Sales / Account Manager
  - Administrator
preconditions:
  - Two users with edit access to the same customer exist.
  - At least one customer record exists.
notes: |
  Run with two browser windows / tabs side by side. Label them
  "User A" and "User B" so the steps stay clear.
steps:
  - n: 1
    action: |
      User A: open customer ACME Industrial. Note current values for
      "phone" and "primary contact name."
    expected: |
      Form is editable.
  - n: 2
    action: |
      User B: in a separate session, open the same customer record.
    expected: |
      Form is editable for User B as well.
  - n: 3
    action: |
      User A: change the phone number. Save.
    expected: |
      Save succeeds. Customer now reflects A's change.
  - n: 4
    action: |
      User B: change the primary contact name (different field). Save.
    expected: |
      The application either:
      (a) merges B's change with A's earlier change (both fields
          reflect their respective edits), OR
      (b) blocks B's save with a conflict message that includes A's
          change and asks B to confirm.

      What is NOT acceptable: B's save silently overwrites A's
      change without warning.
  - n: 5
    action: |
      Reload both sessions. Compare the saved record.
    expected: |
      Both A's and B's changes are reflected (if merged) OR only the
      change User B explicitly confirmed is reflected (if conflict
      was surfaced).
expected_overall: |
  Concurrent edits do not silently lose work.
pass_criteria: |
  No silent overwrite occurred AND the system either merged or
  surfaced a conflict.
why_this_matters: |
  Last-write-wins on shared records loses data invisibly. Users do
  not notice until much later, when "I know I changed that" turns
  out to be true.
est_minutes: 8
```
