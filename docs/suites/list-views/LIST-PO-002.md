## LIST-PO-002 — PO list: partial-match search

```yaml
id: LIST-PO-002
title: PO list supports partial-match search across PO number, vendor, and item
goal: |
  Verify the PO list search is partial, case-insensitive, and spans
  multiple fields (PO number, vendor name, line-item part number /
  description).
roles:
  - Procurement
  - AP / Accounts Payable
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 100 POs exist with varied PO numbers, vendors, and
    line items.
steps:
  - n: 1
    action: |
      Search for a partial PO number (e.g., "4521" against PO
      numbers like "PO-104521-A").
    expected: |
      Partial match returns POs containing that substring.
  - n: 2
    action: |
      Search for a partial vendor name (e.g., "pacif").
    expected: |
      POs from vendors matching that fragment (case-insensitive)
      appear.
  - n: 3
    action: |
      Search for a partial item / part number that appears on PO
      lines.
    expected: |
      POs containing that line item appear.
  - n: 4
    action: |
      Enter a search string with no matches.
    expected: |
      Empty-state message shown. No stale rows.
  - n: 5
    action: |
      Combine search with a status filter (e.g., search "pacif" +
      status = Issued).
    expected: |
      Result is the intersection of search and filter.
expected_overall: |
  PO search supports the day-to-day "find that PO" workflow without
  requiring exact matches.
pass_criteria: |
  Partial / case-insensitive / multi-field search works across the
  expected PO fields.
est_minutes: 5
```
