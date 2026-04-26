## P4-COLL-001 — AR collections: dunning workflow

```yaml
id: P4-COLL-001
title: Run an AR collections / dunning workflow on overdue invoices
goal: |
  Verify the system supports a structured collections process:
  identify invoices past due, send reminder communications at
  documented thresholds (e.g., 15 / 30 / 60 days), and capture a
  collections note per customer.
roles:
  - Controller
  - Sales / Account Manager
flows:
  - quote-to-cash
preconditions:
  - At least one customer has at least one invoice 15+ days past due.
prerequisite_cases:
  - P4-INV-001
steps:
  - n: 1
    action: |
      Find the AR collections / dunning area. Run a collections
      worklist for invoices past due 15+ days.
    expected: |
      Worklist appears with overdue invoices, age buckets, and
      contact info.
  - n: 2
    action: |
      Send the configured reminder communication for one invoice
      (email or letter).
    expected: |
      Communication is generated. The customer record / invoice
      records the touch.
  - n: 3
    action: |
      Add a collections note ("Customer says check is in mail, will
      follow up in 5 days").
    expected: |
      Note saves with timestamp and user.
  - n: 4
    action: |
      Re-run the worklist with a "next-action-due" filter.
    expected: |
      The invoice moves to a follow-up date based on the note.
expected_overall: |
  Dunning loop captures reminders and follow-ups consistently.
pass_criteria: |
  Worklist correct AND reminder generated AND note recorded AND
  follow-up surfaces correctly.
est_minutes: 10
```
