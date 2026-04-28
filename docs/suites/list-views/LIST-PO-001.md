## LIST-PO-001 — Purchase order list UX

```yaml
id: LIST-PO-001
title: PO list supports filter by vendor, status, date range, and sort
goal: |
  Verify the PO list view supports filtering by vendor, status
  (draft / approved / issued / partially received / received / closed),
  date range, and sorting.
roles:
  - Procurement
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 20 POs exist across statuses and vendors.
prerequisite_cases:
  - P3-PO-001
steps:
  - n: 1
    action: |
      Open the PO list. Filter to vendor = Pacific Steel Supply +
      status = Issued.
    expected: |
      Result matches.
  - n: 2
    action: |
      Add a date range: issued in last 30 days.
    expected: |
      Result narrows.
  - n: 3
    action: |
      Sort by total amount (descending).
    expected: |
      Largest POs first.
expected_overall: |
  PO list is usable for procurement workflows.
pass_criteria: |
  Filters / sort all work correctly.
est_minutes: 5
```
