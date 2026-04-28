## BULK-CONTRACT-EXPIRE-001 — Mass-expire contracts past end date

```yaml
id: BULK-CONTRACT-EXPIRE-001
title: Bulk-expire customer or vendor contracts whose end date has passed
goal: |
  Verify a contracts admin can mass-expire a set of contracts whose
  end date has passed, that pricing or terms tied to those contracts
  no longer apply to new transactions, and that already-posted
  transactions remain unchanged.
roles:
  - Contracts Administrator
capabilities:
  - CAP-MD-CONTRACTS-CONSIGNMENT
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 4 contracts exist with end date prior to today and
    status = Active.
  - At least 1 contract has a posted transaction priced under it.
steps:
  - n: 1
    action: |
      Filter contracts to "end date < today AND status = Active."
      Select all. Choose bulk-expire.
    expected: |
      Stage preview lists the affected contracts.
  - n: 2
    action: |
      Confirm.
    expected: |
      All listed contracts move to status Expired. Summary reports
      rows changed.
  - n: 3
    action: |
      Try to create a new SO or PO that would have used one of the
      expired contracts for pricing.
    expected: |
      Contract pricing no longer auto-applies. Standard pricing or
      a warning surfaces. Already-posted transactions retain their
      original contract pricing.
expected_overall: |
  Bulk expire applies forward-only without disturbing posted history.
pass_criteria: |
  Contracts expired AND new transactions skip expired pricing AND
  posted history intact.
est_minutes: 7
```
