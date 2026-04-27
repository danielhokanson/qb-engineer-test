## ACCT-PAY-004 — Year-end employee and contractor summaries prepare without errors

```yaml
id: ACCT-PAY-004
title: Year-end W-2 and 1099 summaries can be generated from posted activity
goal: |
  Verify that at year end the user can generate per-employee wage
  summaries (W-2 equivalent) and per-contractor payment summaries
  (1099 equivalent) from the year's posted payroll and AP activity,
  with totals that tie out to the GL.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Payroll Clerk
preconditions:
  - At least one employee with posted pay-run activity for the year
    exists.
  - At least one contractor (1099-eligible vendor) with posted bills
    for the year exists.
prerequisite_cases:
  - ACCT-PAY-001
  - ACCT-AP-001
steps:
  - n: 1
    action: |
      Open the year-end summaries area.
    expected: |
      Two reports are offered — one for employee wages, one for
      contractor payments — with the year-to-date totals as the
      default range.
  - n: 2
    action: |
      Generate the employee wage summary for the closed-out year.
    expected: |
      Each employee shows year-to-date gross wages, total
      withholdings, and net paid. The sum of gross across employees
      ties to the year's payroll-expense balance in the GL.
  - n: 3
    action: |
      Generate the contractor payment summary.
    expected: |
      Each 1099-eligible vendor shows total payments for the year.
      The sum ties to the corresponding payment activity in the GL.
  - n: 4
    action: |
      Confirm both reports complete without errors and without empty
      or "[object]" rows.
    expected: |
      Both reports render cleanly. Any vendor or employee with zero
      activity is listed as zero or omitted, not shown as broken.
expected_overall: |
  Year-end summaries are generatable, tie out to the GL, and render
  cleanly.
pass_criteria: |
  Both reports generated without error AND totals tie out to GL.
why_this_matters: |
  Year-end forms are a hard regulatory deadline. A summary that does
  not tie out to the books forces the owner to redo the math by hand.
est_minutes: 8
```
