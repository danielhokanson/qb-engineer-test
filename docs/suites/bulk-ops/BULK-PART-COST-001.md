## BULK-PART-COST-001 — Mass-update standard cost on a part set

```yaml
id: BULK-PART-COST-001
title: Bulk-update standard cost on a filtered part set
goal: |
  Verify a cost accountant can mass-update standard cost on a set
  of parts, that the system either reposts inventory at the new
  standard or generates a cost-revaluation journal, and that the
  change is recorded per part with prior and new cost.
roles:
  - Cost Accountant
  - Controller
capabilities:
  - CAP-MD-PARTS
  - CAP-RPT-INVVAL
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 5 parts exist on standard costing with on-hand quantity.
  - GL is open for the current period.
prerequisite_cases:
  - P5-INV-VAL-001
steps:
  - n: 1
    action: |
      Filter parts to "cost method = Standard, category = Raw."
      Select 5. Choose mass-update standard cost. Apply +3 percent.
    expected: |
      Stage shows prior cost, new cost, and inventory revaluation
      impact per part before commit.
  - n: 2
    action: |
      Confirm.
    expected: |
      Update completes. A revaluation journal entry posts (or each
      part posts its own), totaling the previewed dollar impact.
  - n: 3
    action: |
      Spot-check one part's audit / cost history and the GL journal.
    expected: |
      Audit entry shows prior and new cost, who, when. GL entry ties
      to the bulk operation.
expected_overall: |
  Standard cost bulk update revalues inventory and posts to GL with
  audit.
pass_criteria: |
  All parts revalued AND GL posting matches preview AND audit per
  part.
est_minutes: 9
```
