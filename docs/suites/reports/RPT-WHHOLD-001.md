## RPT-WHHOLD-001 — Withholding remittance report ties to AP withholding postings

```yaml
id: RPT-WHHOLD-001
title: Withholding remittance reconciles to per-vendor withholding postings and the payable account
goal: |
  Run the withholding remittance report (e.g., 1099 / 1042 /
  contractor withholding) for the period. Verify per-vendor
  withholding equals what was deducted on payments to that vendor,
  and total withholding ties to the withholding payable GL.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-MD-VENDORS
  - CAP-ACCT-FULLGL
preconditions:
  - At least one vendor is flagged for withholding (P5-WHTAX-001).
  - At least one payment has been made with withholding deducted.
prerequisite_cases:
  - P5-WHTAX-001
  - P3-PAY-001
steps:
  - n: 1
    action: |
      Run the withholding remittance report for the period.
    expected: |
      Report shows per-vendor: gross paid, withholding amount, net
      paid, and a total.
  - n: 2
    action: |
      For one vendor, pull the period's payment register. Sum the
      withholding deductions. Compare.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Verify gross - withholding = net per row.
    expected: |
      Holds within $0.01.
  - n: 4
    action: |
      Sum total withholding. Compare to the withholding payable
      GL balance for the period.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Confirm a non-withholding vendor does NOT appear on the
      report.
    expected: |
      Excluded.
expected_overall: |
  Withholding totals reconcile per-vendor and at the GL.
pass_criteria: |
  Per-vendor withholding matches payment register within $0.01
  AND total ties to withholding payable GL within $0.01 AND
  non-withholding vendors are excluded.
why_this_matters: |
  Withholding remittance is filed with tax authorities and the
  vendor uses it to file their own taxes. Errors create dual
  liability — to the vendor and to the tax authority.
est_minutes: 10
```
