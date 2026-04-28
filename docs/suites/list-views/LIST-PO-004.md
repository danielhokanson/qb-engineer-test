## LIST-PO-004 — PO list: multi-column sort

```yaml
id: LIST-PO-004
title: PO list supports stable multi-column sort
goal: |
  Verify the PO list supports a multi-column sort (e.g., status,
  then due date, then total amount) and that the precedence is
  visually clear.
roles:
  - Procurement
  - AP / Accounts Payable
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 POs exist across multiple statuses, due dates, and
    total amounts.
steps:
  - n: 1
    action: |
      Sort by status (ascending) as primary.
    expected: |
      POs group by status. Sort indicator shows status as primary.
  - n: 2
    action: |
      Add secondary sort: due date (ascending).
    expected: |
      Within each status, POs are ordered earliest-due first.
  - n: 3
    action: |
      Add tertiary sort: total amount (descending).
    expected: |
      Within each (status, due date) group, ties break by amount
      largest-first.
  - n: 4
    action: |
      Reverse primary direction (status descending).
    expected: |
      Group order flips. Secondary and tertiary unchanged.
  - n: 5
    action: |
      Clear all sorts.
    expected: |
      Default ordering restored.
expected_overall: |
  Multi-column sort supports realistic procurement triage views.
pass_criteria: |
  Sort precedence is correct, stable, and visually communicated.
est_minutes: 5
```
