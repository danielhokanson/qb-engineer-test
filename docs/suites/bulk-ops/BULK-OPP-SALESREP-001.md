## BULK-OPP-SALESREP-001 — Mass-reassign opportunities to a new sales rep

```yaml
id: BULK-OPP-SALESREP-001
title: Reassign opportunities in a region to a new sales rep
goal: |
  Verify a sales manager can mass-reassign open opportunities from
  one rep to another (e.g., territory change), that visibility
  follows the new ownership immediately, and the change is audit-
  logged per opportunity with prior and new owner.
roles:
  - Sales Manager
  - Administrator
capabilities:
  - CAP-O2C-LEAD
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 5 open opportunities are owned by Rep A.
  - Rep B exists and has the same territory permissions.
steps:
  - n: 1
    action: |
      Filter opportunities to "owner = Rep A AND status = Open."
      Select all. Choose mass-reassign owner. Set new owner = Rep B.
    expected: |
      Stage preview shows affected opportunities.
  - n: 2
    action: |
      Confirm.
    expected: |
      All listed opportunities now show owner = Rep B. Summary
      reports rows changed.
  - n: 3
    action: |
      Sign in as Rep A and as Rep B. Review their respective
      opportunity pipelines.
    expected: |
      A no longer sees the reassigned opportunities. B does.
      Audit on each opportunity records prior and new owner.
expected_overall: |
  Opportunity reassignment is clean and immediate.
pass_criteria: |
  Ownership flipped AND visibility correct on both sides AND audit
  per opportunity.
est_minutes: 6
```
