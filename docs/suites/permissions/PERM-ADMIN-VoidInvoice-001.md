## PERM-ADMIN-VoidInvoice-001 — Administrator cannot void an invoice

```yaml
id: PERM-ADMIN-VoidInvoice-001
title: Administrator is denied voiding a posted customer invoice
goal: |
  Verify the Administrator role cannot void a posted invoice. Voiding
  is a financial reversal action that belongs to Controller; the
  Administrator owns tenant configuration, not finance.
roles:
  - Administrator
preconditions:
  - The Administrator user exists with no other roles attached.
  - At least one posted customer invoice exists.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Open a posted invoice.
    expected: |
      The void / cancel action is hidden, disabled, or not available.
  - n: 2
    action: |
      Attempt the void endpoint via direct URL.
    expected: |
      The action is rejected with an authorization error.
  - n: 3
    action: |
      If an API is exposed, attempt the void-invoice call.
    expected: |
      The request is rejected.
expected_overall: |
  Administrator cannot void an invoice.
pass_criteria: |
  Invoice not voided AND no GL reversal posted AND attempt rejected
  at every accessible surface.
why_this_matters: |
  Tenant administrators frequently get over-permissioned because
  "they're admin, they should be able to do anything." For financial
  reversals that defeats the audit story — the Administrator's
  authority should stop at tenant configuration.
est_minutes: 4
```
