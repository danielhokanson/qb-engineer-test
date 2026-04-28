## PERM-PROCUREMENT-VoidInvoice-001 — Procurement cannot void a customer invoice

```yaml
id: PERM-PROCUREMENT-VoidInvoice-001
title: Procurement is denied voiding a posted customer invoice
goal: |
  Verify a Procurement user cannot void posted customer invoices.
  Procurement handles vendor-side documents, not AR.
roles:
  - Procurement
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one posted customer invoice exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Open a posted customer invoice if
      visible.
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
  Procurement cannot void a customer invoice.
pass_criteria: |
  Invoice not voided AND no GL reversal posted AND attempt rejected.
est_minutes: 4
```
