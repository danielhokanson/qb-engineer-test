## AUDIT-COST-CHANGE-001 — Standard cost changes record before / after

```yaml
id: AUDIT-COST-CHANGE-001
title: Updating a part's standard cost is logged with prior and new cost
goal: |
  Verify that changing a part's standard cost records actor, timestamp,
  prior cost, new cost, effective date, and a reference to any
  inventory revaluation entry produced.
roles:
  - Controller
  - Cost Accountant
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - An active part with a standard cost and on-hand inventory exists.
prerequisite_cases:
  - AUDIT-PART-CREATE-001
steps:
  - n: 1
    action: |
      Open the part. Change the standard cost to a new value with an
      effective date. Save.
    expected: |
      Change saves and any revaluation entry is produced.
  - n: 2
    action: |
      Open the part's audit log filtered to cost events.
    expected: |
      Cost change entry shows actor, timestamp, prior cost, new cost,
      and effective date. If on-hand inventory triggered a revaluation,
      a reference to the revaluation GL entry is included.
expected_overall: |
  Cost changes are fully audited and tied to any GL revaluation.
pass_criteria: |
  Cost change entry present AND captures attribution, prior / new
  cost, and revaluation reference when applicable.
why_this_matters: |
  Standard cost changes silently shift inventory valuation and gross
  margin. Without an audit trail, large unexplained margin shifts at
  month-end cannot be traced back to who changed what.
est_minutes: 5
```
