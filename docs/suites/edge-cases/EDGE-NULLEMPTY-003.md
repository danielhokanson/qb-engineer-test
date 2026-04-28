## EDGE-NULLEMPTY-003 — Null numeric field on a report differs from zero

```yaml
id: EDGE-NULLEMPTY-003
title: A report distinguishes "no value" from "zero" in numeric columns where the difference matters
goal: |
  Verify that on a report column where null and zero are
  semantically different (e.g., "preferred lead time" — null means
  "not configured," zero means "next-day"), the report renders them
  distinctly so the user can act on each correctly.
roles:
  - Administrator
  - Procurement
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least one entity with a numeric field where null and zero
    differ in meaning.
steps:
  - n: 1
    action: |
      Identify a part where preferred lead time is null (never set)
      and another where it is set to 0.
    expected: |
      Both records exist.
  - n: 2
    action: |
      Run a parts list / report that includes the lead time column.
    expected: |
      Null shows as a clear marker (blank, em dash, or "—" / "not
      set"). Zero shows as "0". The two are visually distinct.
  - n: 3
    action: |
      Filter the report by "lead time is not set."
    expected: |
      Only the null-valued record matches; the zero-valued record
      does NOT.
  - n: 4
    action: |
      Filter the report by "lead time = 0."
    expected: |
      Only the zero-valued record matches; the null-valued record
      does NOT.
  - n: 5
    action: |
      Export the report. Confirm the export represents null and zero
      distinctly.
    expected: |
      Distinct representation in the export, documented.
expected_overall: |
  Null and zero in numeric fields are distinguishable wherever the
  semantics differ.
pass_criteria: |
  Visual distinction in display AND filter discriminates correctly
  AND export distinguishes the two.
why_this_matters: |
  Conflating null and zero on numeric configuration fields produces
  silent misbehavior — items with "no preferred lead time" get
  treated as "next-day," or vice versa. The distinction has to ride
  through the entire UI and reporting stack.
est_minutes: 8
```
