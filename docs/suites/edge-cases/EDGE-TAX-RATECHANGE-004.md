## EDGE-TAX-RATECHANGE-004 — Tax filing report partitions amounts by rate-effective period

```yaml
id: EDGE-TAX-RATECHANGE-004
title: A periodic tax filing report shows old-rate and new-rate amounts separately
goal: |
  Verify that when a tax rate changed mid-period, the period-end tax
  filing report breaks out taxable sales and tax amounts under the old
  rate and the new rate as distinct subtotals — so the filing matches
  what the jurisdiction expects.
roles:
  - Controller
capabilities:
  - CAP-MD-TAXCODES
  - CAP-RPT-FINANCIALS
preconditions:
  - A tax-rate change occurred mid-period.
  - At least one invoice was issued under each rate within the period.
steps:
  - n: 1
    action: |
      Run the tax filing report for the period covering the rate change.
    expected: |
      Report renders.
  - n: 2
    action: |
      Inspect the report for separate subtotals by rate-effective
      window — old-rate taxable sales, old-rate tax, new-rate taxable
      sales, new-rate tax.
    expected: |
      Both rate windows are shown distinctly. The split is unambiguous.
  - n: 3
    action: |
      Verify the grand totals at the bottom equal the sum of the two
      rate windows.
    expected: |
      Match.
  - n: 4
    action: |
      Spot-check one invoice from each window against the report's
      classification.
    expected: |
      Each invoice appears under the right rate window per its date.
expected_overall: |
  Tax filing report respects rate-effective windows and breaks them
  out cleanly.
pass_criteria: |
  Old-rate and new-rate subtotals are distinct AND grand totals
  reconcile AND spot-checked invoices classify correctly.
why_this_matters: |
  Tax filings have to declare amounts by rate. A report that lumps
  old and new rate together makes the controller hand-split the file
  every time a rate changes — and hand-splitting is where bugs live.
est_minutes: 10
```
