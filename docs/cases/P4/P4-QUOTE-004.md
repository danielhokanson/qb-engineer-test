## P4-QUOTE-004 — Quote revision with version history

```yaml
id: P4-QUOTE-004
title: Revise a sent quote and preserve the prior version
goal: |
  Verify a quote that has been sent to a customer can be revised
  without losing the original — both versions are preserved, the
  customer-facing copy clearly shows it's revision 2, and prior
  revisions remain auditable.
roles:
  - Sales / Account Manager
flows:
  - quote-to-cash
preconditions:
  - At least one sent quote exists.
prerequisite_cases:
  - P4-QUOTE-001
steps:
  - n: 1
    action: |
      Open a sent quote. Use the revise / amend action.
    expected: |
      A new revision (e.g., Rev B) is staged. The original is
      preserved.
  - n: 2
    action: |
      Change one line price. Add a new line. Save and re-send.
    expected: |
      Customer-facing document shows Rev B clearly. Quote number
      stays the same; revision letter / number increments.
  - n: 3
    action: |
      Open the quote history.
    expected: |
      Both revisions visible. The customer can be told which revision
      they should look at.
expected_overall: |
  Quote revisions preserve prior versions and clearly mark the active
  one.
pass_criteria: |
  Both revisions visible AND active rev marked AND prior rev is read-only.
est_minutes: 6
```
