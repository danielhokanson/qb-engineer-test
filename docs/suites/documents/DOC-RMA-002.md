## DOC-RMA-002 — RMA email delivery to the customer

```yaml
id: DOC-RMA-002
title: RMA authorization emails to the customer with PDF attached
goal: |
  Verify an approved RMA can be emailed to the customer contact, the
  email body uses a configurable template, the PDF is attached, the
  send is logged on the RMA, and the recipient mailbox receives it.
roles:
  - Customer Service
capabilities:
  - CAP-CROSS-DOCS
  - CAP-CROSS-NOTIFICATIONS
  - CAP-O2C-RMA
preconditions:
  - An approved RMA exists.
  - The customer has a valid email contact.
prerequisite_cases:
  - DOC-RMA-001
steps:
  - n: 1
    action: |
      Open the RMA. Use the email action.
    expected: |
      Email composer opens with default template, recipient = customer
      contact, subject including RMA number, PDF attached.
  - n: 2
    action: |
      Send the email.
    expected: |
      Email dispatches. The send is logged on the RMA with date,
      recipient, status.
  - n: 3
    action: |
      Check the recipient test mailbox.
    expected: |
      Email arrives. PDF opens correctly and matches the RMA content.
expected_overall: |
  RMA email delivery works end-to-end.
pass_criteria: |
  Email sent AND received AND PDF intact AND log recorded on the RMA.
est_minutes: 5
```
