## ACCT-RPT-006 — Sales tax summary reconciles to invoiced tax

```yaml
id: ACCT-RPT-006
title: Sales-tax summary for a period equals the sum of tax lines on posted invoices
goal: |
  Verify that the sales-tax summary report for a chosen period
  reports total tax collected per jurisdiction, and that the sum
  across jurisdictions equals the sum of every tax line on every
  posted (non-void) invoice in the period — and equals the
  sales-tax-payable liability on the balance sheet less prior
  remittances.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-MD-TAXCODES
  - CAP-O2C-INVOICE
preconditions:
  - At least three posted invoices in the period collected sales
    tax at the home jurisdiction's rate.
prerequisite_cases:
  - ACCT-AR-001
  - ACCT-SETUP-004
steps:
  - n: 1
    action: |
      Run the sales-tax summary for the current period.
    expected: |
      Tax collected by jurisdiction is shown, with a grand total.
  - n: 2
    action: |
      Open each posted invoice in the period and sum its tax-line
      amounts.
    expected: |
      Manual sum equals the report's grand total.
  - n: 3
    action: |
      Compare to the sales-tax-payable balance on the balance sheet
      (less any prior period remittances).
    expected: |
      Liability matches the period's collected tax (net of remittances).
expected_overall: |
  Sales-tax summary ties to invoice tax lines and to the
  sales-tax-payable liability.
pass_criteria: |
  Report grand total = manual invoice tax-line sum = sales-tax-payable
  on balance sheet (net of remittances), all to the cent.
why_this_matters: |
  The number reported on this summary becomes the figure remitted to
  the tax authority. If it does not tie to invoices, the shop either
  underpays (penalty) or overpays (lost cash).
est_minutes: 8
```
