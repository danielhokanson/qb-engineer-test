## DOC-INV-001 — Invoice email delivery with PDF attached

```yaml
id: DOC-INV-001
title: Customer invoice emails to the customer with PDF attached
goal: |
  Verify a posted customer invoice can be emailed to the customer's
  AR contact, the email body uses a configurable template, the PDF
  is attached, and delivery succeeds.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - At least one posted customer invoice exists.
  - The customer has a valid AR email address.
prerequisite_cases:
  - P4-INV-001
steps:
  - n: 1
    action: |
      Open the invoice. Use the email action.
    expected: |
      Email composer opens with default template, recipient = AR
      contact, subject including invoice number, PDF attached.
  - n: 2
    action: |
      Send.
    expected: |
      Email is dispatched. The send is logged on the invoice (date,
      recipient, status).
  - n: 3
    action: |
      Check the recipient mailbox (test address).
    expected: |
      Email arrives. PDF opens correctly.
expected_overall: |
  Invoice email delivery works end-to-end.
pass_criteria: |
  Email sent AND received AND PDF intact AND send is logged on the
  invoice.
est_minutes: 6
```
