## RPT-BALSHEET-004 — Balance sheet by entity / segment ties to dimension postings

```yaml
id: RPT-BALSHEET-004
title: Per-entity (or per-segment) balance sheet rolls up to consolidated
goal: |
  Run the balance sheet filtered by entity or segment dimension.
  Verify each entity's balance sheet balances independently AND the
  per-entity totals roll up to the consolidated balance sheet.
roles:
  - Controller
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-ACCT-FULLGL
preconditions:
  - Postings carry an entity / segment dimension and at least two
    distinct values exist.
  - Each entity has its own AR, inventory, and equity activity.
prerequisite_cases:
  - P5-CLOSE-004
  - RPT-BALSHEET-001
steps:
  - n: 1
    action: |
      Run the balance sheet filtered to entity A.
    expected: |
      Report renders. Total assets = total liabilities + equity for
      that entity to the cent.
  - n: 2
    action: |
      Run the balance sheet filtered to entity B.
    expected: |
      Same — balances to the cent for that entity.
  - n: 3
    action: |
      Sum (entity A assets + entity B assets + any others). Compare
      to the consolidated balance sheet's total assets.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Repeat for total liabilities + equity.
    expected: |
      Match within $0.01.
expected_overall: |
  Each entity's balance sheet balances and per-entity totals roll up
  cleanly to the consolidated.
pass_criteria: |
  Every per-entity sheet balances AND the per-entity sum equals the
  consolidated within $0.01.
est_minutes: 12
```
