## EDGE-FX-ROUNDING-001 — FX conversion rounds consistently and balances

```yaml
id: EDGE-FX-ROUNDING-001
title: Multi-currency conversion rounds consistently across header, lines, and totals
goal: |
  Verify that a transaction in a foreign currency, when displayed or
  posted in the home currency, has line totals that sum to the header
  total within the application's documented rounding tolerance — and
  that the GL entries balance to zero in both currencies.
roles:
  - Controller
capabilities:
  - CAP-MD-CURRENCIES
  - CAP-ACCT-BUILTIN
preconditions:
  - At least one foreign-currency vendor or customer exists
    (P2-VENDOR-003 or P2-CUST-004).
  - An FX rate is configured for the relevant pair.
steps:
  - n: 1
    action: |
      Create a vendor invoice in EUR with three line items at non-round
      amounts (e.g., €33.33, €33.33, €33.34). Post.
    expected: |
      Header total in EUR: €100.00. Posts cleanly.
  - n: 2
    action: |
      Read the home-currency (USD) values on the invoice header and
      lines.
    expected: |
      The sum of the line USD values equals the header USD value
      within $0.01 (or whatever tolerance the application documents).
      The tolerance is explicitly stated, not silent.
  - n: 3
    action: |
      Open the GL postings.
    expected: |
      Postings balance to zero in both EUR (transaction currency) and
      USD (home currency). No rounding remainder is left dangling.
expected_overall: |
  FX-converted transactions sum cleanly and post a balanced ledger
  in both currencies.
pass_criteria: |
  Line USD totals match header USD total within tolerance AND GL is
  balanced in both currencies.
why_this_matters: |
  Penny rounding errors in FX accumulate — the kind of bug that
  shows up as a $0.03 imbalance after a thousand multi-currency
  invoices and takes a week to track down.
est_minutes: 8
```
