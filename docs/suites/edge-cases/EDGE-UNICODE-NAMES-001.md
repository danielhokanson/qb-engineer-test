## EDGE-UNICODE-NAMES-001 — Customer name with accented Latin and CJK characters round-trips intact

```yaml
id: EDGE-UNICODE-NAMES-001
title: A customer name containing accented Latin and CJK characters saves, displays, and exports unchanged
goal: |
  Verify that a customer name like "Société Générale 株式会社" can be
  entered, saved, reloaded, exported to CSV, and re-imported without
  any character corruption (no mojibake, no question marks, no
  silent transliteration).
roles:
  - Administrator
  - AR Clerk
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-LIST-UX
preconditions:
  - Customer creation is available.
  - CSV export and import are available for customers.
steps:
  - n: 1
    action: |
      Create a customer named exactly "Société Générale 株式会社".
      Save.
    expected: |
      Save succeeds. Form does not strip or mangle any character.
  - n: 2
    action: |
      Reload the customer record.
    expected: |
      Name displays exactly as entered, character-for-character.
  - n: 3
    action: |
      Export the customer list to CSV. Open the CSV in a UTF-8 aware
      editor.
    expected: |
      Name is intact in the file. Encoding is UTF-8 with or without
      BOM, documented either way.
  - n: 4
    action: |
      Re-import the same CSV (perhaps to a sandbox tenant). Confirm
      the imported customer name still matches.
    expected: |
      Round-trip is exact.
  - n: 5
    action: |
      Search the customer list for a substring of the name (e.g.,
      "Générale" or "株式").
    expected: |
      Search finds the customer. No silent ASCII-only fallback.
expected_overall: |
  Unicode customer names are first-class — entered, stored, displayed,
  exported, imported, and searched without corruption.
pass_criteria: |
  Saved name matches input exactly AND CSV round-trip preserves it
  AND search finds it by Unicode substring.
why_this_matters: |
  Mojibake on customer names is a hallmark of legacy systems that
  treat non-ASCII as second-class. In a global business, the system
  has to handle every name correctly or it can't be used.
est_minutes: 10
```
