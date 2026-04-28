## ACCT-PAY-001 — Pay run records wages and tax-withholding liabilities

```yaml
id: ACCT-PAY-001
title: Running payroll records gross wages, net pay, and withholding owed
goal: |
  Verify that a basic pay run for one or more employees records
  gross wages as a payroll expense, net pay as a cash decrease,
  and the difference (income tax, FICA, or equivalent withholdings)
  as separate liabilities owed to the relevant authorities.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Payroll Clerk
capabilities:
  - CAP-HR-PAYROLL
  - CAP-ACCT-FULLGL
preconditions:
  - At least one active employee exists with a configured pay rate.
  - Withholding rates are configured at a basic level.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note the period payroll expense, the cash balance, and the
      payroll-tax-owed liability balance.
    expected: |
      All three values visible. Record them.
  - n: 2
    action: |
      Run a pay run for one employee with $1,000.00 gross. Apply
      $200.00 in total withholdings. Net pay is $800.00.
    expected: |
      The pay run posts. The employee's pay statement shows gross
      $1,000.00, withholdings $200.00, net $800.00.
  - n: 3
    action: |
      Re-check the three figures.
    expected: |
      Payroll expense increased by $1,000.00 (the full gross). Cash
      decreased by $800.00 (the net paid out). Payroll-tax-owed
      liability increased by $200.00.
expected_overall: |
  Pay run splits gross wages into cash out and a withholding liability
  to be remitted later.
pass_criteria: |
  Payroll expense up by $1,000.00 AND cash down by $800.00 AND
  withholding liability up by $200.00.
why_this_matters: |
  Booking the entire gross as cash out — or skipping the withholding
  liability — leaves the shop owing taxes off-book. This is one of
  the most common ways small shops get into trouble at year end.
est_minutes: 7
```
