## ACCT-AP-001 — Recording a vendor bill increases what the shop owes

```yaml
id: ACCT-AP-001
title: A new vendor bill increases the AP balance for that vendor
goal: |
  Verify that when the user records a vendor bill, the vendor's
  balance owed increases by the bill total and the shop's total
  accounts payable increases by the same amount.
optional_module: builtin-accounting
roles:
  - Shop Owner
  - AP Clerk
preconditions:
  - The accounting module is set up.
  - At least one active vendor exists with a starting balance of zero.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note the vendor's current owed balance and the shop's total
      accounts payable on the dashboard.
    expected: |
      Both values are visible. Record them.
  - n: 2
    action: |
      Record a new vendor bill for $300.00 with at least one expense
      line, dated within the current open period.
    expected: |
      The bill posts and shows status "open" or "unpaid".
  - n: 3
    action: |
      Re-check the vendor balance and the shop AP total.
    expected: |
      Vendor owed balance increased by exactly $300.00. Shop AP total
      increased by exactly $300.00.
expected_overall: |
  Recording the bill raises both the vendor-level and shop-level
  payable balances by the bill total.
pass_criteria: |
  Vendor owed increased by $300.00 AND shop AP increased by $300.00.
est_minutes: 4
```
