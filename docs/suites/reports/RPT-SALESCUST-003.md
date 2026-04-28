## RPT-SALESCUST-003 — Sales by customer broken down by sales rep

```yaml
id: RPT-SALESCUST-003
title: Sales-by-customer with sales-rep breakdown ties to per-rep invoice attribution
goal: |
  Run the sales-by-customer report broken down (or filtered) by
  sales rep. Verify each rep's total equals the sum of invoices
  attributed to that rep, and per-rep totals roll up to the
  unfiltered grand total.
roles:
  - Controller
  - Sales / Account Manager
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-O2C-INVOICE
preconditions:
  - Invoices exist with at least two distinct sales rep
    attributions.
prerequisite_cases:
  - P4-INV-001
  - RPT-SALESCUST-001
steps:
  - n: 1
    action: |
      Run sales-by-customer grouped by sales rep, or filtered to
      rep A.
    expected: |
      Report shows revenue attributed to rep A.
  - n: 2
    action: |
      From the invoice register, sum invoices attributed to rep A
      in the period. Compare.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Run filtered to rep B. Sum.
    expected: |
      Available.
  - n: 4
    action: |
      Confirm (rep A + rep B + ... unassigned) total equals the
      unfiltered grand total.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Spot-check: a customer invoice attributed to rep A appears in
      rep A's column, not rep B's.
    expected: |
      Correct attribution.
expected_overall: |
  Rep attribution on each invoice flows through to the report and
  per-rep sums equal the consolidated.
pass_criteria: |
  Per-rep total matches invoice register within $0.01 AND per-rep
  sum equals consolidated within $0.01.
why_this_matters: |
  Commissions and quota attainment use this report. Mis-attributed
  invoices lead to underpaid reps or paying the wrong rep — both
  cause friction.
est_minutes: 10
```
