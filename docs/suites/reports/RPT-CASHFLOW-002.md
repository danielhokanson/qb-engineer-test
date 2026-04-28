## RPT-CASHFLOW-002 — Direct-method cash flow ties to cash-account postings

```yaml
id: RPT-CASHFLOW-002
title: Direct-method cash flow reconciles to cash-account postings
goal: |
  Run the cash flow statement in direct-method mode (cash receipts
  from customers, cash paid to suppliers, etc.). Verify each line
  equals the actual cash-account postings classified to that source.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
preconditions:
  - The application supports direct-method cash flow (or both
    methods).
  - The period has been closed and a bank rec is complete.
prerequisite_cases:
  - P5-CLOSE-004
  - P5-BANK-001
steps:
  - n: 1
    action: |
      Run the cash flow statement in direct-method mode.
    expected: |
      Report shows operating cash inflows / outflows by category
      (receipts from customers, payments to suppliers, payroll,
      etc.) instead of the indirect adjustments.
  - n: 2
    action: |
      Cash receipts from customers: from the bank register, sum
      deposits coded as customer payments in the period. Compare.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Cash paid to suppliers: sum bank disbursements coded to
      vendor payments in the period. Compare.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Net change in cash = total inflows - total outflows. Compare
      to (ending cash - beginning cash) on the balance sheet.
    expected: |
      Match within $0.01.
expected_overall: |
  Direct-method cash flow ties to actual bank-account postings and
  the net change reconciles to balance-sheet cash movement.
pass_criteria: |
  Customer receipts, supplier payments, and net change in cash all
  reconcile within $0.01.
notes: |
  Skip this case if the application only supports indirect-method
  cash flow; record as N/A rather than a fail.
est_minutes: 12
```
