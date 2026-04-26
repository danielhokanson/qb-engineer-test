## ACCT-AP-005 — Voiding a vendor bill reverses cleanly

```yaml
id: ACCT-AP-005
title: Voiding an unpaid vendor bill reverses AP and the expense without residue
goal: |
  Verify that voiding a posted but unpaid vendor bill removes its
  impact from accounts payable and from the expense account, leaves
  the original bill visible (marked void) for audit, and does not
  create duplicate or orphan entries.
optional_module: builtin-accounting
roles:
  - Shop Owner
  - AP Clerk
preconditions:
  - At least one posted, unpaid vendor bill exists.
prerequisite_cases:
  - ACCT-AP-001
steps:
  - n: 1
    action: |
      Note the vendor owed balance and the period-to-date expense
      total for the bill's category.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Open the unpaid bill and choose "Void". Confirm.
    expected: |
      The bill's status changes to "void". The bill remains in the
      vendor's bill history with the void label.
  - n: 3
    action: |
      Re-check the vendor balance and the expense total.
    expected: |
      Vendor owed returned to its pre-bill value. Expense total
      decreased by the bill's amount.
expected_overall: |
  Void reverses both AP and the expense; the original bill is preserved
  as void.
pass_criteria: |
  Bill marked void AND vendor owed back to pre-bill level AND expense
  total reduced by the bill amount AND original bill visible in history.
est_minutes: 5
```
