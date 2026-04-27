## ACCT-TAX-002 — Remitting collected sales tax to the authority

```yaml
id: ACCT-TAX-002
title: Recording a sales-tax remittance reduces the sales-tax-payable liability and cash
goal: |
  Verify that when the user records a sales-tax remittance to the
  jurisdiction's authority, the sales-tax-payable liability
  decreases by the remitted amount, cash decreases by the same
  amount, and the period's sales-tax summary reflects the
  remittance.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
preconditions:
  - A sales-tax-payable liability exists from prior collection
    activity (e.g., $7.25 from ACCT-TAX-001).
prerequisite_cases:
  - ACCT-TAX-001
steps:
  - n: 1
    action: |
      Note the sales-tax-payable balance and the cash balance.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Open the sales-tax remittance area. Record a remittance for the
      full payable balance to the home jurisdiction.
    expected: |
      The remittance posts. A confirmation appears.
  - n: 3
    action: |
      Re-check the figures.
    expected: |
      Sales-tax-payable decreased by exactly the remitted amount
      (e.g., $7.25). Cash decreased by exactly the remitted amount.
  - n: 4
    action: |
      Run the sales-tax summary report.
    expected: |
      The report shows the remittance separately from collected tax,
      so the user can see at a glance what is collected, what is
      remitted, and what still owes.
expected_overall: |
  Remittance reduces the liability, reduces cash, and is visible on the
  tax summary.
pass_criteria: |
  Sales-tax-payable down by remitted amount AND cash down by remitted
  amount AND tax summary shows the remittance.
est_minutes: 6
```
