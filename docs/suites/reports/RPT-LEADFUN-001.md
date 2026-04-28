## RPT-LEADFUN-001 — Lead funnel report ties to lead, opportunity, and SO records

```yaml
id: RPT-LEADFUN-001
title: Lead funnel reconciles per-stage lead counts to underlying lead and opportunity records
goal: |
  Run the lead funnel report for the period. Verify each stage
  count (new lead → qualified → opportunity → quote → SO) equals
  the count of records currently in or converted from that stage,
  and stage-to-stage conversion rates compute correctly.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-O2C-LEAD
  - CAP-O2C-QUOTE
preconditions:
  - At least 5 leads exist with stage history spanning at least
    3 funnel stages.
prerequisite_cases:
  - P2-LEAD-001
  - P2-LEAD-002
  - P4-QUOTE-001
steps:
  - n: 1
    action: |
      Run the lead funnel report for the period.
    expected: |
      Report shows per-stage counts and stage-to-stage conversion %.
  - n: 2
    action: |
      Filter the lead register by stage = "qualified" entered in
      the period. Count.
    expected: |
      Compare to the report's qualified count. Match.
  - n: 3
    action: |
      Repeat for "opportunity" and "quote" stages.
    expected: |
      Match per stage.
  - n: 4
    action: |
      Verify stage-to-stage conversion = (next stage count) /
      (prior stage count). Compute and compare.
    expected: |
      Match within 0.1 pp.
  - n: 5
    action: |
      Confirm a lead marked "lost" is excluded from the active
      funnel counts.
    expected: |
      Excluded.
expected_overall: |
  Funnel counts and conversion rates reflect actual lead stage
  history.
pass_criteria: |
  Per-stage count matches lead-register filter AND stage-to-stage
  conversion matches within 0.1 pp AND lost leads excluded.
est_minutes: 10
```
