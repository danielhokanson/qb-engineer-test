## EDGE-FX-ROUNDING-003 — Zero-decimal currency (JPY) is never displayed with cents

```yaml
id: EDGE-FX-ROUNDING-003
title: A transaction in a zero-decimal currency (Japanese Yen) is stored and displayed as integer units
goal: |
  Verify that a transaction in a zero-decimal currency such as JPY
  shows whole-yen amounts everywhere — no decimals, no implicit
  fractional storage that displays rounded — and that conversions to
  and from JPY respect this.
roles:
  - Controller
capabilities:
  - CAP-MD-CURRENCIES
  - CAP-O2C-INVOICE
  - CAP-O2C-CASH
preconditions:
  - JPY (or any zero-decimal currency) is configured as a transaction
    currency.
  - An FX rate to home currency is configured.
steps:
  - n: 1
    action: |
      Create a customer invoice in JPY for ¥10,000.
    expected: |
      Header displays as "¥10,000" — no decimals, no "¥10,000.00".
  - n: 2
    action: |
      Inspect line totals on the same invoice.
    expected: |
      Lines display as whole yen.
  - n: 3
    action: |
      Convert to home currency. Confirm the home value displays at the
      home currency's documented decimal precision (e.g., USD shows
      two decimals).
    expected: |
      Each currency displays at its own precision; JPY values never
      show fractional yen.
  - n: 4
    action: |
      Apply a partial payment of ¥3,333 in JPY. Confirm AR balance
      remaining shows ¥6,667 — whole yen — not ¥6,666.67.
    expected: |
      Whole-yen arithmetic is preserved.
expected_overall: |
  Zero-decimal currencies are treated as integer units everywhere.
pass_criteria: |
  No fractional JPY ever displays AND home-currency conversion respects
  its own precision separately AND payment math stays in whole yen.
why_this_matters: |
  ERPs that hardcode two decimals for all currencies treat ¥10,000.50
  as a meaningful amount. It isn't. Currencies have their own decimal
  rules and the system has to honor them.
est_minutes: 8
```
