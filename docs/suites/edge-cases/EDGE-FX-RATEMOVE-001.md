## EDGE-FX-RATEMOVE-001 — FX rate change between invoice and payment produces correct gain/loss

```yaml
id: EDGE-FX-RATEMOVE-001
title: A rate movement between invoice date and payment date posts a realized FX gain or loss
goal: |
  Verify that an invoice in foreign currency settled at a different
  FX rate than it was issued posts a realized gain or loss to the
  correct GL account — not a silent home-currency adjustment buried
  in revenue.
roles:
  - Controller
preconditions:
  - A foreign-currency customer exists.
  - An open invoice in that currency exists, posted at one rate.
  - The FX rate has been updated to a different rate before payment.
steps:
  - n: 1
    action: |
      Read the invoice's home-currency value at issuance (rate × foreign
      amount).
    expected: |
      Home-currency value visible.
  - n: 2
    action: |
      Apply a payment in the foreign currency at the new rate.
    expected: |
      Payment posts. Home-currency cash receipt = foreign amount × new
      rate.
  - n: 3
    action: |
      Examine the JE postings.
    expected: |
      The difference between the invoice's home value and the
      payment's home value posts to a Realized FX Gain (or Loss)
      account — not to revenue, not to AR.
expected_overall: |
  Rate movement is captured as a realized FX gain or loss in the
  right account.
pass_criteria: |
  Gain or loss equals (foreign amount × (new rate - old rate)) within
  $0.01 AND posts to the FX gain/loss account.
est_minutes: 8
```
