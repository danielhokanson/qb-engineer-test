## EDGE-SCALE-LARGELIST-002 — Multi-column sort on a 5,000+ row list view returns deterministic order

```yaml
id: EDGE-SCALE-LARGELIST-002
title: Sorting a list view by multiple columns produces a stable and deterministic order at scale
goal: |
  Verify that on a list view of 5,000+ rows, applying a primary sort
  followed by a secondary sort (e.g., status ascending, then created
  date descending) produces the same row order on repeated loads — no
  shuffling, no missing rows on subsequent pages.
roles:
  - Administrator
  - Procurement
preconditions:
  - 5,000+ records exist for the entity (e.g., parts).
  - List view supports at least two-column sorting.
notes: |
  Reconciled in Phase 2 to align with the application's documented
  single-key + stable-secondary pagination contract (see CLAUDE.md
  §pagination, e.g. `?page=1&pageSize=25&sort=createdAt&order=desc`).
  Multi-column sort, if implemented, is treated as enrichment beyond
  baseline. Baseline pass requires a single sort key paired with a
  stable secondary tiebreaker (typically the primary id).
  If multi-column sort is not supported, the multi-column step is an
  enrichment check — mark that step Not Applicable and document; the
  case as a whole still passes if the single-key + stable-secondary
  contract holds.
steps:
  - n: 1
    action: |
      On the parts list, sort by primary column (status ascending),
      secondary by created date descending.
    expected: |
      Sort applies; first page renders.
  - n: 2
    action: |
      Page through to a deep page (e.g., page 50). Note three rows.
    expected: |
      Page renders and the rows respect the sort hierarchy.
  - n: 3
    action: |
      Reload the same query. Page back to page 50.
    expected: |
      The same three rows appear in the same order. Deterministic.
  - n: 4
    action: |
      Add or rearrange a sort tiebreaker (e.g., add "id ascending" as
      a third sort).
    expected: |
      Sort changes deterministically; no row dropouts on any page.
expected_overall: |
  Sort at scale is stable and deterministic. Baseline contract is a
  single sort key paired with a stable secondary tiebreaker
  (typically the primary id); multi-column sort, if implemented, is
  verified as an enrichment on top of that baseline.
pass_criteria: |
  Single sort key with a stable secondary (typically primary id)
  produces a deterministic order: repeated load of the same query
  returns identical order AND no rows are dropped or duplicated
  across paging. Multi-column sort, where supported, behaves as an
  enrichment that preserves the same determinism guarantees.
why_this_matters: |
  A non-deterministic sort at scale silently makes lists that look
  identical on every refresh actually be different — pagination
  becomes unreliable, exports become non-reproducible.
est_minutes: 10
```
