## LIST-PAY-002 — Payment list: filter by method / status

```yaml
id: LIST-PAY-002
title: Payment list filters by method and by clearing status
goal: |
  Verify the payment list filters by method (cash / check / ACH /
  wire / card / other) and by clearing status (pending / cleared /
  bounced / void).
roles:
  - AR / Collections
  - AP / Accounts Payable
  - Controller
capabilities:
  - CAP-O2C-CASH
  - CAP-CROSS-LIST-UX
preconditions:
  - At least 50 payments exist across all supported methods and
    clearing states.
steps:
  - n: 1
    action: |
      Filter to method = Check.
    expected: |
      Only check payments appear.
  - n: 2
    action: |
      Multi-select method: ACH + Wire.
    expected: |
      Result is the union of those methods.
  - n: 3
    action: |
      Filter to clearing status = Pending.
    expected: |
      Only pending payments appear.
  - n: 4
    action: |
      Combine method filter with status = Bounced.
    expected: |
      Result is the intersection.
  - n: 5
    action: |
      Clear all filters.
    expected: |
      Default view restored.
expected_overall: |
  Method / status filtering supports cash management and
  reconciliation triage.
pass_criteria: |
  Single, multi-select, and combined filters all behave correctly.
est_minutes: 5
```
