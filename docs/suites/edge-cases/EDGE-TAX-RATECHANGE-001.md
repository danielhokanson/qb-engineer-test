## EDGE-TAX-RATECHANGE-001 — Tax-rate change mid-period uses the right rate per transaction date

```yaml
id: EDGE-TAX-RATECHANGE-001
title: Tax rate changes mid-period; each transaction taxes per its own date
goal: |
  Verify that when a tax rate changes effective on a date mid-period,
  invoices dated before the change use the old rate and invoices
  dated after use the new rate — and that the rate-change effective
  date is itself audited.
roles:
  - Controller
preconditions:
  - At least one tax code with a known rate exists (P1-TAX-001).
  - The current period is open and at least 5 days have passed.
steps:
  - n: 1
    action: |
      Update the tax code: change the rate, with an effective date
      mid-period (e.g., the 15th).
    expected: |
      The application requires an effective date for the change. Both
      the old and new rates remain visible with their effective ranges.
  - n: 2
    action: |
      Create a customer invoice dated the 14th of the period (before
      the change).
    expected: |
      Tax computes using the old rate.
  - n: 3
    action: |
      Create a customer invoice dated the 16th of the period (after
      the change).
    expected: |
      Tax computes using the new rate.
  - n: 4
    action: |
      Open the tax code's audit log.
    expected: |
      The rate change is recorded with actor, timestamp, prior rate,
      new rate, and effective date.
expected_overall: |
  Tax rate change is dated and per-transaction; history of the rate
  is preserved.
pass_criteria: |
  Old-rate invoice taxes with old rate AND new-rate invoice taxes
  with new rate AND audit captures the change cleanly.
why_this_matters: |
  ERPs that just overwrite a tax rate and apply it retroactively
  invalidate every prior invoice's tax line. Tax-rate change has to
  be effective-dated, not destructive.
est_minutes: 8
```
