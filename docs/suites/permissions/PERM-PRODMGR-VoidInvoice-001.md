## PERM-PRODMGR-VoidInvoice-001 — Production Manager cannot void an invoice

```yaml
id: PERM-PRODMGR-VoidInvoice-001
title: Production Manager is denied voiding a posted customer invoice
goal: |
  Verify a Production Manager cannot void posted customer invoices.
roles:
  - Production Manager
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one posted customer invoice exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Open a posted invoice if visible.
    expected: |
      Void / cancel action is hidden or disabled.
  - n: 2
    action: |
      Attempt the void endpoint via direct URL.
    expected: |
      The action is rejected.
  - n: 3
    action: |
      If an API is exposed, attempt the void-invoice call.
    expected: |
      The request is rejected.
expected_overall: |
  Production Manager cannot void an invoice.
pass_criteria: |
  Invoice not voided AND no GL reversal posted AND attempt rejected.
est_minutes: 4
```
