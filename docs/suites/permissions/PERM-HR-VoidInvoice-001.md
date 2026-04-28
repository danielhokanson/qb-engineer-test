## PERM-HR-VoidInvoice-001 — HR cannot void an invoice

```yaml
id: PERM-HR-VoidInvoice-001
title: HR is denied voiding a posted customer invoice
goal: |
  Verify an HR user cannot void posted customer invoices.
roles:
  - HR
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An HR user exists with no other roles attached.
  - At least one posted customer invoice exists.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for any AR / invoice surface.
    expected: |
      No AR / invoice surface is reachable.
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
  HR cannot void an invoice.
pass_criteria: |
  Invoice not voided AND no GL reversal posted AND attempt rejected.
est_minutes: 3
```
