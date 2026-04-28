## ACCT-TAX-003 — Tax-exempt customer is skipped from tax collection

```yaml
id: ACCT-TAX-003
title: An invoice for a tax-exempt customer collects no sales tax
goal: |
  Verify that when the user creates an invoice for a customer flagged
  as tax-exempt, the application does not add a sales tax line, the
  invoice total equals the taxable subtotal, and the
  sales-tax-payable liability is unchanged.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
capabilities:
  - CAP-MD-TAXCODES
  - CAP-O2C-INVOICE
  - CAP-MD-CUSTOMERS
preconditions:
  - Home tax jurisdiction is set with a known rate.
  - At least one customer is flagged as tax-exempt with an exemption
    reason or certificate reference recorded.
prerequisite_cases:
  - ACCT-SETUP-004
steps:
  - n: 1
    action: |
      Note the sales-tax-payable balance.
    expected: |
      Value visible. Record it.
  - n: 2
    action: |
      Create an invoice for the tax-exempt customer with a $100.00
      line.
    expected: |
      No tax line is added. Subtotal = $100.00 and total = $100.00.
      The invoice or customer record displays the exemption reason
      (or certificate reference) clearly.
  - n: 3
    action: |
      Post the invoice and re-check the sales-tax-payable balance.
    expected: |
      Sales-tax-payable balance unchanged.
expected_overall: |
  Tax-exempt customer flag suppresses tax computation and tax
  liability accrual, with the exemption reason visible.
pass_criteria: |
  No tax on invoice AND total = $100.00 AND sales-tax-payable unchanged
  AND exemption reason / certificate visible.
why_this_matters: |
  Charging tax to an exempt customer breaks the customer relationship
  and forces a credit-and-rebill. Failing to record the exemption
  reason fails an audit.
est_minutes: 5
```
