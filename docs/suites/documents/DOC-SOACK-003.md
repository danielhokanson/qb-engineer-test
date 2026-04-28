## DOC-SOACK-003 — SO acknowledgment email delivery

```yaml
id: DOC-SOACK-003
title: SO acknowledgment emails to the customer with PDF attached
goal: |
  Verify the sales order acknowledgment can be emailed from the SO,
  the email body uses a configurable template, the PDF is attached,
  the send is logged on the SO, and the recipient mailbox receives
  it.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-CROSS-DOCS
  - CAP-CROSS-NOTIFICATIONS
  - CAP-O2C-SO
preconditions:
  - An accepted sales order with a valid customer email contact
    exists.
prerequisite_cases:
  - DOC-SOACK-001
steps:
  - n: 1
    action: |
      Open the SO. Use the email action.
    expected: |
      Email composer opens with default template, recipient = customer
      sales contact, subject including SO number, PDF attached.
  - n: 2
    action: |
      Send the email.
    expected: |
      Email dispatches. The send is logged on the SO with date,
      recipient, status.
  - n: 3
    action: |
      Check the recipient test mailbox.
    expected: |
      Email arrives. PDF opens correctly and matches the SO content.
expected_overall: |
  SO acknowledgment email delivery works end-to-end.
pass_criteria: |
  Email sent AND received AND PDF intact AND log recorded on the SO.
est_minutes: 6
```
