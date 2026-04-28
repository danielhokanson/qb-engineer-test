## EDGE-NULLEMPTY-001 — Empty string and null in optional text fields behave identically

```yaml
id: EDGE-NULLEMPTY-001
title: An optional text field stored as empty string and as null are indistinguishable to the user
goal: |
  Verify that an optional text field (e.g., customer "notes")
  containing an empty string and the same field never set (null) are
  treated identically — same display, same search behavior, same
  export representation — so the user is not exposed to two states
  for "no value."
roles:
  - Administrator
  - AR Clerk
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least one entity with an optional text field (customer notes
    or part description).
steps:
  - n: 1
    action: |
      Create customer A and leave the notes field untouched.
    expected: |
      Save succeeds.
  - n: 2
    action: |
      Create customer B, type into notes, then delete every character
      so the field is empty. Save.
    expected: |
      Save succeeds.
  - n: 3
    action: |
      Open both records side-by-side.
    expected: |
      The notes field renders identically — typically blank — for
      both. The user cannot tell A from B by inspection.
  - n: 4
    action: |
      Run a filter "notes is blank" or equivalent.
    expected: |
      Both A and B match. Neither is silently excluded because one is
      null and the other is empty string.
  - n: 5
    action: |
      Export the customer list to CSV. Inspect the notes column for
      both A and B.
    expected: |
      Both are represented identically (e.g., both empty cells, or
      both quoted-empty). No silent "NULL" string in one and not the
      other.
expected_overall: |
  Empty string and null in optional fields are user-equivalent.
pass_criteria: |
  Display matches AND filter "is blank" matches both AND export
  representation matches.
why_this_matters: |
  Distinguishing empty string from null at the user-facing level is a
  database leak. Users care about "do I have a value or not" — not
  the SQL state. The application has to abstract that.
est_minutes: 8
```
