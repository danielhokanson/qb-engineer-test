## EDGE-NULLEMPTY-002 — Required text field rejects whitespace-only entry

```yaml
id: EDGE-NULLEMPTY-002
title: A required text field rejects whitespace-only input as if it were empty
goal: |
  Verify that a required text field (e.g., customer name) rejects an
  entry consisting only of whitespace characters (spaces, tabs,
  zero-width characters) — not just the literal empty string — to
  prevent records that look blank but exist.
roles:
  - Administrator
  - AR Clerk
capabilities:
  - CAP-MD-CUSTOMERS
preconditions:
  - At least one entity with a required text field.
steps:
  - n: 1
    action: |
      Attempt to create a customer with name = "   " (three spaces).
    expected: |
      Form rejects with a clear required-field validation message.
  - n: 2
    action: |
      Attempt to create a customer with name = "\t" (a tab character).
    expected: |
      Same rejection.
  - n: 3
    action: |
      Attempt to create a customer with name = "​" (zero-width
      space) or other invisible Unicode whitespace if input is
      possible.
    expected: |
      Either rejected (preferred) OR accepted with the invisible
      character preserved exactly. Silent stripping that produces an
      empty record is unacceptable.
  - n: 4
    action: |
      Confirm that a name with leading/trailing whitespace around real
      content (e.g., " Acme ") is either preserved exactly or trimmed
      per a documented rule.
    expected: |
      Behavior is consistent and documented.
expected_overall: |
  Required fields cannot be satisfied with whitespace-only content.
pass_criteria: |
  Whitespace-only rejected AND zero-width characters handled
  predictably AND trim rule documented.
why_this_matters: |
  A "name field" filled with spaces produces a customer record that
  shows up blank in lists, breaks search, and is invisible to users
  trying to find or merge it. The validation has to look past raw
  length.
est_minutes: 6
```
