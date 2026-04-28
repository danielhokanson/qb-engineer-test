## PERM-WAREHOUSE-VoidInvoice-001 — Warehouse cannot void an invoice

```yaml
id: PERM-WAREHOUSE-VoidInvoice-001
title: Warehouse / Logistics is denied voiding a posted customer invoice
goal: |
  Verify a Warehouse user cannot void invoices. They confirm
  shipments — which trigger invoice creation — but do not adjust
  invoices after the fact.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Warehouse user exists with no other roles attached.
  - At least one posted customer invoice exists.
steps:
  - n: 1
    action: |
      Sign in as Warehouse. Open the invoice if visible from the
      shipment view.
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
  Warehouse cannot void an invoice.
pass_criteria: |
  Invoice not voided AND no GL reversal posted AND attempt rejected.
est_minutes: 4
```
