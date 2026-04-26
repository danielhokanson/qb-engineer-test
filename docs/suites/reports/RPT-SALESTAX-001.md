## RPT-SALESTAX-001 — Sales tax / VAT return ties to taxable sales and tax-coded postings

```yaml
id: RPT-SALESTAX-001
title: Sales tax / VAT return reconciles to taxable invoice lines and tax payable account
goal: |
  Run the sales tax (or VAT) return report for the period. Verify
  each tax-rate row equals the sum of taxable invoice lines at that
  rate × rate, and the total tax due equals the tax payable account
  balance on the trial balance.
roles:
  - Controller
preconditions:
  - The period has invoices spanning at least two tax rates / tax
    jurisdictions.
  - At least one invoice has tax-exempt lines.
  - VAT/tax codes are configured (P1-TAX-001).
prerequisite_cases:
  - P1-TAX-001
  - P4-INV-001
  - P5-VAT-001
steps:
  - n: 1
    action: |
      Run the sales tax / VAT return for the period.
    expected: |
      Report shows per-rate / per-jurisdiction taxable base and
      tax due, plus a total.
  - n: 2
    action: |
      For one rate, sum invoice lines coded to that rate. Multiply
      by the rate. Compare to the report's tax line.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Verify tax-exempt lines are excluded from the taxable base.
    expected: |
      Excluded.
  - n: 4
    action: |
      Sum tax due across all rates. Compare to the tax payable
      account balance for the period (from trial balance).
    expected: |
      Match within $0.01.
expected_overall: |
  Tax return ties to taxable invoice lines and to the tax payable
  GL balance.
pass_criteria: |
  Per-rate tax matches (taxable base × rate) within $0.01 AND
  total ties to tax payable GL within $0.01 AND exempt lines
  excluded.
why_this_matters: |
  This report is filed with tax authorities. Underreporting risks
  penalties; overreporting wastes cash. Either is a common audit
  finding when source data and report don't reconcile.
est_minutes: 12
```
