## LIST-PAY-001 — Payment list: partial-match search

```yaml
id: LIST-PAY-001
title: Payment list supports partial-match search by reference / payee
goal: |
  Verify the payment list (AR cash receipts and / or AP payments,
  per the system's design) supports partial, case-insensitive
  search across payment reference / check number, payee /
  customer / vendor name, and applied document number.
roles:
  - AR / Collections
  - AP / Accounts Payable
capabilities:
  - CAP-O2C-CASH
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 100 payments exist across customers / vendors with
    varied references and check numbers.
steps:
  - n: 1
    action: |
      Open the payment list. Search for a partial check / reference
      number.
    expected: |
      Partial match returns payments whose reference contains the
      fragment.
  - n: 2
    action: |
      Search for a partial payee name.
    expected: |
      Payments to / from payees matching the fragment appear.
  - n: 3
    action: |
      Search for an applied document number (e.g., invoice number).
    expected: |
      Payments applied to that document appear.
  - n: 4
    action: |
      Enter a search string with no matches.
    expected: |
      Empty-state message shown. No stale rows.
  - n: 5
    action: |
      Combine search with a method filter (e.g., ACH).
    expected: |
      Result is the intersection.
expected_overall: |
  Payment search supports daily reconciliation and inquiry workflows.
pass_criteria: |
  Partial / case-insensitive / multi-field search works correctly.
est_minutes: 5
```
