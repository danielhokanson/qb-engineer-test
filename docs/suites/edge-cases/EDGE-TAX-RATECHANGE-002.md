## EDGE-TAX-RATECHANGE-002 — Credit memo against an old-rate invoice uses the original tax rate

```yaml
id: EDGE-TAX-RATECHANGE-002
title: A credit memo issued after a tax-rate change applies the original invoice's rate
goal: |
  Verify that a credit memo issued against an invoice that used the
  pre-change tax rate computes its tax at the original rate — not at
  the current rate — so the credit zeroes out the original invoice's
  tax line cleanly.
roles:
  - Controller
  - AR Clerk
capabilities:
  - CAP-MD-TAXCODES
  - CAP-O2C-CREDITMEMO
preconditions:
  - A tax rate change exists with an effective date.
  - At least one customer invoice was issued at the old rate before
    the change.
steps:
  - n: 1
    action: |
      Read the tax rate on the old invoice. Confirm the current tax
      rate is different.
    expected: |
      Old rate visible on the invoice; current rate is different.
  - n: 2
    action: |
      Issue a full credit memo against the old invoice.
    expected: |
      Credit memo computes tax at the OLD rate, matching the original
      invoice's tax line exactly.
  - n: 3
    action: |
      Issue a partial credit memo (e.g., 25%) against the same invoice.
    expected: |
      Partial credit's tax = 25% of the original invoice's tax (at the
      old rate), within penny rounding.
  - n: 4
    action: |
      Confirm the AR ledger zeroes out cleanly when the credit equals
      the invoice.
    expected: |
      No residual penny imbalance from rate mismatch.
expected_overall: |
  Credit memos respect the originating invoice's tax rate, not the
  current rate.
pass_criteria: |
  Full credit equals the original invoice's tax exactly AND partial
  credit scales proportionally AND no residual after full credit.
why_this_matters: |
  Crediting at the new rate when the original invoice used the old
  rate leaves dangling tax balances and corrupts tax filings. The
  credit has to mirror the original.
est_minutes: 8
```
