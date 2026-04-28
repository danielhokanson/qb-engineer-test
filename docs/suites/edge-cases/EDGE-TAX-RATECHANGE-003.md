## EDGE-TAX-RATECHANGE-003 — Future-dated tax-rate change does not affect today's invoices

```yaml
id: EDGE-TAX-RATECHANGE-003
title: A tax-rate change scheduled for a future effective date does not alter current-period invoices
goal: |
  Verify that scheduling a tax-rate change with a future effective
  date stores the new rate but leaves all current invoices, both
  before and after the schedule action, computing tax at the still-
  current rate until the effective date arrives.
roles:
  - Controller
capabilities:
  - CAP-MD-TAXCODES
  - CAP-O2C-INVOICE
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A tax code with a known current rate.
  - The current period is open.
steps:
  - n: 1
    action: |
      Schedule a tax-rate change with an effective date 30 days in the
      future.
    expected: |
      Application accepts the schedule. Both rates are visible with
      their effective windows.
  - n: 2
    action: |
      Create a customer invoice dated today.
    expected: |
      Tax computes at the CURRENT rate, not the future rate.
  - n: 3
    action: |
      Create another customer invoice dated 15 days in the future
      (still before the rate effective date).
    expected: |
      Tax computes at the current rate.
  - n: 4
    action: |
      Create a customer invoice dated 31 days in the future (after
      the rate effective date).
    expected: |
      Tax computes at the new rate.
  - n: 5
    action: |
      Confirm the audit log records who scheduled the change and when,
      including the future effective date.
    expected: |
      Schedule action is auditable.
expected_overall: |
  Tax-rate effective dates are honored — future-scheduled rates do
  not retroactively or prematurely affect transactions.
pass_criteria: |
  Each invoice taxes per its own date relative to the effective date
  AND the schedule action is auditable AND no premature rate
  application.
why_this_matters: |
  Jurisdictions announce rate changes weeks or months ahead. The
  ability to pre-stage the new rate without affecting current
  invoicing is the whole reason effective-dating exists.
est_minutes: 10
```
