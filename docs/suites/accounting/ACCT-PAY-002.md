## ACCT-PAY-002 — Expense reimbursement to an employee

```yaml
id: ACCT-PAY-002
title: Reimbursing an employee expense increases the right expense and decreases cash
goal: |
  Verify that the user can record an expense reimbursement to an
  employee — for items the employee paid out of pocket — and that
  the expense lands in the correct expense category while cash
  decreases by the reimbursed amount.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - Payroll Clerk
capabilities:
  - CAP-ACCT-EXPENSES
preconditions:
  - At least one active employee exists.
  - The chart of accounts includes at least one expense category
    suitable for the reimbursed item (e.g., "Office supplies").
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note the period expense total for the chosen category and the
      cash balance.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Record a $75.00 reimbursement to an employee for office supplies
      they purchased.
    expected: |
      The reimbursement is recorded and tied to the employee. It is
      not treated as wages and does not generate withholdings.
  - n: 3
    action: |
      Re-check the figures.
    expected: |
      Office-supplies expense increased by $75.00. Cash decreased by
      $75.00. Payroll expense and withholding liabilities unchanged.
expected_overall: |
  Reimbursement is treated as a normal expense, not as compensation.
pass_criteria: |
  Office-supplies expense up by $75.00 AND cash down by $75.00 AND
  no impact on payroll figures.
est_minutes: 4
moot:
  decision: moot-by-design
  determined_at: 2026-04-28
  determined_by: Phase 3 closeout / orchestrator-approved
  reason: |
    Payroll is delegated to the connected accounting/payroll provider.
    The "no payroll-impact" pass criterion is unverifiable in either mode
    (standalone has no payroll module; QB-connected delegates payroll to QB).
  consultant_guidance: |
    Reimbursements are recorded via /expenses (separate from payroll surfaces).
    Any payroll-side impact verification must be performed in the connected
    accounting/payroll provider — qb-engineer does not own the payroll-vs-expense
    category split.
  alternative_behavior: |
    /expenses POST records the reimbursement against the employee with the
    chosen expense category. Cash leg lives in the accounting provider.
```
