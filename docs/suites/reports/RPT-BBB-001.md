## RPT-BBB-001 — Bookings / billings / backlog report ties to SO, invoice, and open SO registers

```yaml
id: RPT-BBB-001
title: Bookings, billings, and backlog reconcile to SO confirmations, invoices, and open SOs
goal: |
  Run the bookings / billings / backlog (BBB) report for the
  period. Verify bookings = sum of SOs confirmed in the period,
  billings = sum of invoices issued in the period, and backlog =
  open SO value as of the report date.
roles:
  - Sales / Account Manager
  - Controller
preconditions:
  - At least one SO was confirmed in the period (P4-QUOTE-005 or
    SO confirmation pathway).
  - At least one invoice was issued in the period (P4-INV-001).
  - At least one SO remains open (not fully shipped/invoiced) as
    of the report date.
prerequisite_cases:
  - P4-QUOTE-005
  - P4-INV-001
steps:
  - n: 1
    action: |
      Run the BBB report for the period.
    expected: |
      Report shows three numbers (or trend): bookings, billings,
      backlog.
  - n: 2
    action: |
      Bookings: sum SO total of all SOs confirmed within the
      period. Compare.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Billings: sum invoice totals issued in the period. Compare.
    expected: |
      Match within $0.01 (and equals revenue from sales-by-customer
      grand total within $0.01).
  - n: 4
    action: |
      Backlog: open SO value as of the report date = sum of (SO
      total - billed amount) per open SO. Compare.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Roll-forward identity: opening backlog + bookings - billings
      = ending backlog. Verify (within $0.01).
    expected: |
      Identity holds.
expected_overall: |
  All three numbers reconcile to source registers and the BBB
  identity holds.
pass_criteria: |
  Bookings, billings, backlog each reconcile within $0.01 AND
  the BBB roll-forward identity holds within $0.01.
why_this_matters: |
  BBB is the headline sales-pipeline KPI. A wrong backlog leads
  to wrong forecasting, wrong capacity planning, and wrong board
  guidance.
est_minutes: 12
```
