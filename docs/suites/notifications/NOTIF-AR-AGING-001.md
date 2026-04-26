## NOTIF-AR-AGING-001 — AR aging trigger on invoice past due

```yaml
id: NOTIF-AR-AGING-001
title: AR aging triggers fire at documented aging buckets
goal: |
  Verify that when an invoice crosses an aging bucket boundary
  (e.g., enters 31-60 days past due), a notification fires to the
  collections / controller team, surfacing the invoice for action.
roles:
  - Controller
  - Sales / Account Manager
preconditions:
  - At least one customer invoice exists.
prerequisite_cases:
  - P4-INV-001
  - P4-COLL-001
steps:
  - n: 1
    action: |
      Backdate (or wait) so an existing invoice crosses into the
      31-60 day past-due bucket.
    expected: |
      An AR aging notification fires.
  - n: 2
    action: |
      Apply payment to the invoice.
    expected: |
      Alert clears.
expected_overall: |
  Aging-bucket alert fires and clears.
pass_criteria: |
  Alert fires at bucket transition AND clears on payment.
est_minutes: 5
```
