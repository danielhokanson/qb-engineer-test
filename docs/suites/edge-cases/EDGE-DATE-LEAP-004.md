## EDGE-DATE-LEAP-004 — Bulk import of dates rejects February 29 in non-leap years

```yaml
id: EDGE-DATE-LEAP-004
title: A CSV bulk import containing February 29 of a non-leap year is rejected per row, not silently coerced
goal: |
  Verify that a bulk import file with rows dated February 29 of a
  non-leap year produces clear per-row errors and does not silently
  coerce them to February 28 or March 1.
roles:
  - Administrator
capabilities:
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least one entity (e.g., customers, parts, invoices) supports
    CSV bulk import with a date field.
steps:
  - n: 1
    action: |
      Prepare a CSV with five rows — three with valid dates, two with
      February 29 of a non-leap year (e.g., 2027-02-29). Import.
    expected: |
      Import processes the file. Three rows succeed; two are flagged
      as errors.
  - n: 2
    action: |
      Read the error report.
    expected: |
      Each invalid row is identified by row number. The error message
      cites the invalid date specifically.
  - n: 3
    action: |
      Confirm none of the invalid rows were silently coerced to
      February 28 or March 1.
    expected: |
      No silent coercion. The user keeps control of the data.
expected_overall: |
  Bulk import treats non-leap February 29 as invalid input, surfaces
  it, and does not coerce.
pass_criteria: |
  Valid rows imported AND invalid rows flagged with row number AND no
  silent date coercion occurred.
why_this_matters: |
  Silent date coercion in bulk import is a data-integrity bug that
  hides until someone looks at the wrong record and asks "why is this
  date a day off?" The right answer is to fail loud.
est_minutes: 6
```
