## DOC-CM-003 — Credit memo email delivery

```yaml
id: DOC-CM-003
title: Credit memo emails to the customer with PDF attached
goal: |
  Verify a posted credit memo can be emailed to the customer's AR
  contact, the email body uses a configurable template, the PDF is
  attached, the send is logged on the credit memo, and the recipient
  mailbox receives it.
roles:
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-CROSS-NOTIFICATIONS
  - CAP-O2C-CREDITMEMO
preconditions:
  - A posted credit memo exists.
  - The customer has a valid AR email address.
prerequisite_cases:
  - DOC-CM-001
steps:
  - n: 1
    action: |
      Open the credit memo. Use the email action.
    expected: |
      Email composer opens with default template, recipient = AR
      contact, subject including credit memo number, PDF attached.
  - n: 2
    action: |
      Send the email.
    expected: |
      Email dispatches. The send is logged on the credit memo with
      date, recipient, status.
  - n: 3
    action: |
      Check the recipient test mailbox.
    expected: |
      Email arrives. PDF opens correctly and matches the credit memo
      content.
expected_overall: |
  Credit memo email delivery works end-to-end.
pass_criteria: |
  Email sent AND received AND PDF intact AND log recorded on the
  credit memo.
est_minutes: 6
```
