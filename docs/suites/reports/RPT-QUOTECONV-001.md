## RPT-QUOTECONV-001 — Quote conversion rate ties to quote / SO history

```yaml
id: RPT-QUOTECONV-001
title: Quote conversion rate reconciles to issued quotes vs. quotes that became SOs
goal: |
  Run the quote conversion rate report for the period. Verify the
  numerator (quotes converted to SOs) and denominator (quotes
  issued) reflect actual quote history, and the conversion % is
  computed correctly.
roles:
  - Sales / Account Manager
  - Controller
preconditions:
  - At least 5 quotes were issued in the period, with at least one
    converted to an SO and one explicitly lost / expired.
prerequisite_cases:
  - P4-QUOTE-001
  - P4-QUOTE-005
steps:
  - n: 1
    action: |
      Run the quote conversion report for the period.
    expected: |
      Report shows: quotes issued, quotes converted, quotes lost,
      quotes pending, conversion %.
  - n: 2
    action: |
      Pull the quote register filtered to the period. Count
      issued.
    expected: |
      Compare to the report's denominator. Match.
  - n: 3
    action: |
      Filter to converted (linked to an SO). Count.
    expected: |
      Compare to the numerator. Match.
  - n: 4
    action: |
      Verify conversion % = converted / issued × 100, rounded as
      documented.
    expected: |
      Match within 0.1 pp.
  - n: 5
    action: |
      Confirm a still-pending quote is counted in "pending," not
      converted or lost.
    expected: |
      Correct status bucket.
expected_overall: |
  Quote conversion ratio reflects real quote history with correct
  status bucketing.
pass_criteria: |
  Numerator and denominator match hand counts AND conversion %
  matches within 0.1 pp AND status buckets are correct.
why_this_matters: |
  Sales pipeline metrics drive forecasting. Wrong conversion rate
  distorts pipeline coverage analysis and quota planning.
est_minutes: 10
```
