## EDGE-UNICODE-NAMES-003 — Emoji and supplementary-plane characters in a part description are preserved

```yaml
id: EDGE-UNICODE-NAMES-003
title: A part description containing emoji and other 4-byte UTF-8 characters saves and displays without truncation
goal: |
  Verify that a part description containing 4-byte UTF-8 characters
  (emoji, rarer CJK characters in supplementary planes) saves
  completely without silent truncation at the multi-byte boundary —
  a classic symptom of a 3-byte UTF-8 column or naive byte-length
  truncation.
roles:
  - Engineer / R&D
  - Administrator
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-INTEG-FILE
preconditions:
  - Part creation is available.
steps:
  - n: 1
    action: |
      Create a part with description "Bracket assembly — premium 🔧
      grade (𠮷野家 supplier)". Save.
    expected: |
      Save succeeds. No characters are stripped or replaced.
  - n: 2
    action: |
      Reload the part. Read the description.
    expected: |
      Description matches input exactly, including the emoji and the
      supplementary-plane CJK character (𠮷, U+20BB7).
  - n: 3
    action: |
      Edit the description to start with the emoji. Save and reload.
    expected: |
      Leading emoji is preserved. No truncation at the first byte
      boundary.
  - n: 4
    action: |
      Export the part list. Confirm the description in the export
      matches.
    expected: |
      Export round-trip is exact.
expected_overall: |
  4-byte UTF-8 characters are first-class in text fields.
pass_criteria: |
  Saved description matches input exactly AND emoji and supplementary-
  plane characters survive round-trips.
why_this_matters: |
  Databases configured for 3-byte UTF-8 (the legacy MySQL default)
  silently truncate 4-byte characters at the first one encountered.
  The bug is invisible until a customer's emoji-laden part name comes
  back blank.
est_minutes: 8
```
