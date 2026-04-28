## ACCT-TAX-001 — Sales tax collected on a customer invoice

```yaml
id: ACCT-TAX-001
title: A taxable customer invoice adds sales tax and increases sales-tax-payable
goal: |
  Verify that when the user creates an invoice for a non-exempt
  customer, the home jurisdiction's tax rate is applied to the
  taxable subtotal, the invoice total includes the tax, and the
  sales-tax-payable liability increases by the collected tax
  amount.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
capabilities:
  - CAP-MD-TAXCODES
  - CAP-O2C-INVOICE
preconditions:
  - Home tax jurisdiction is set with a known rate (use ACCT-SETUP-004's
    7.25%).
  - At least one non-exempt customer exists.
prerequisite_cases:
  - ACCT-SETUP-004
steps:
  - n: 1
    action: |
      Note the sales-tax-payable liability balance.
    expected: |
      Value visible. Record it.
  - n: 2
    action: |
      Create an invoice for the non-exempt customer with a $100.00
      taxable line.
    expected: |
      The invoice's subtotal is $100.00, tax is $7.25 (7.25% of
      $100.00), and total is $107.25. Tax line is labeled with the
      jurisdiction's name.
  - n: 3
    action: |
      Post the invoice and re-check the sales-tax-payable balance.
    expected: |
      Sales-tax-payable increased by exactly $7.25.
expected_overall: |
  Tax is computed correctly per the home rate and accrued as a
  liability owed to the authority.
pass_criteria: |
  Invoice tax = $7.25 AND invoice total = $107.25 AND
  sales-tax-payable up by $7.25.
est_minutes: 5
moot:
  decision: moot-by-design
  determined_at: 2026-04-28
  determined_by: Phase 3 closeout / orchestrator-approved
  reason: |
    Sales-tax-payable liability balance is GL territory. qb-engineer's
    accounting boundary delegates GL to the connected accounting provider.
    The pass criterion ("sales-tax-payable up by $7.25") belongs in
    builtin-accounting-full-gl (not implemented; intentionally delegated).
  consultant_guidance: |
    Tax computation is correct (subtotal+rate=total verified per invoice).
    The liability accumulation lives in your accounting provider — confirm
    the sales-tax-payable balance there, not in qb-engineer.
  alternative_behavior: |
    Invoice records taxRate, taxAmount, and total. The accounting provider
    receives the posted invoice via the sync queue and accumulates the
    liability balance on its own books.
```
