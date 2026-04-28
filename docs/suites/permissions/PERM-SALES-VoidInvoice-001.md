## PERM-SALES-VoidInvoice-001 — Sales cannot void a posted invoice

```yaml
id: PERM-SALES-VoidInvoice-001
title: Sales / Account Manager is denied voiding a posted invoice
goal: |
  Verify a Sales user, who can create draft invoices, cannot void a
  posted one — that's a financial action belonging to the Controller.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists.
  - At least one posted customer invoice exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Open the posted invoice.
    expected: |
      Void / cancel action is hidden, disabled, or replaced with a
      "request void" handoff.
  - n: 2
    action: |
      Attempt the void via direct URL or API.
    expected: |
      Action is rejected with a clear authorization error.
expected_overall: |
  Sales cannot void posted invoices.
pass_criteria: |
  Invoice not voided AND no GL reversal posted AND attempt was
  rejected at every accessible surface.
est_minutes: 5
```
