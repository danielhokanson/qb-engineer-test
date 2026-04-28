## EDGE-FX-ROUNDING-002 — Triangulated FX (foreign → home → reporting) does not double-round

```yaml
id: EDGE-FX-ROUNDING-002
title: A transaction in a foreign currency reported in a third currency rounds once, not twice
goal: |
  Verify that when a transaction in currency A is reported in currency
  C through home currency B, the conversion does not silently round
  at B before computing C — which would compound rounding error.
roles:
  - Controller
capabilities:
  - CAP-MD-CURRENCIES
  - CAP-RPT-FINANCIALS
preconditions:
  - The home currency is, e.g., USD.
  - At least one foreign-currency transaction in EUR exists.
  - A reporting currency (e.g., GBP) is configured.
notes: |
  If the application supports only home + transaction currency (no
  separate reporting currency), mark the case Not Applicable and
  document the limitation.
steps:
  - n: 1
    action: |
      Read the EUR amount of the source transaction and the EUR/USD
      and USD/GBP rates in effect.
    expected: |
      All three values visible.
  - n: 2
    action: |
      Read the GBP value reported on the same transaction.
    expected: |
      GBP value visible.
  - n: 3
    action: |
      Compute by hand: EUR × (USD/EUR rate) × (GBP/USD rate), using
      full precision at each step and rounding only at the end. Compare
      to the displayed GBP value.
    expected: |
      Displayed GBP value matches the hand-computed value within the
      documented tolerance. It does NOT match what you would get if
      USD were rounded to two decimals before the second conversion.
expected_overall: |
  Triangulated FX rounds once, at the final reporting currency.
pass_criteria: |
  Reporting-currency value matches single-rounding hand calculation
  within tolerance AND clearly differs from the double-rounded value.
why_this_matters: |
  Multi-entity reporting that double-rounds through home currency
  silently inflates rounding error proportional to the number of
  conversion legs. Across a year, it shows up as unexplained variance.
est_minutes: 10
```
