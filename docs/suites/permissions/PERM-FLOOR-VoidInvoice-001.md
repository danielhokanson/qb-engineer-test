## PERM-FLOOR-VoidInvoice-001 — Floor Operator cannot void an invoice

```yaml
id: PERM-FLOOR-VoidInvoice-001
title: Floor Operator is denied voiding a posted customer invoice
goal: |
  Verify a Floor Operator cannot void invoices.
roles:
  - Floor Operator
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one posted customer invoice exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any invoice surface.
    expected: |
      No invoice surface is reachable.
  - n: 2
    action: |
      Type the invoice URL directly.
    expected: |
      The page does not render an editable invoice or void action.
  - n: 3
    action: |
      If an API is exposed, attempt the void-invoice call.
    expected: |
      The request is rejected.
expected_overall: |
  Floor Operator cannot void an invoice.
pass_criteria: |
  Invoice not voided AND no GL reversal posted AND attempt rejected.
est_minutes: 3
```
