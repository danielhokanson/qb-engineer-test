## EDGE-DATE-LEAP-003 — Lead time and aging math handles leap day correctly

```yaml
id: EDGE-DATE-LEAP-003
title: A planning lead time that crosses February 29 lands on the right date
goal: |
  Verify that an MRP / planning calculation of "need date minus lead
  time" that crosses February 29 in a leap year arrives at the correct
  start date — not off by a day either direction.
roles:
  - Planner
  - Buyer
capabilities:
  - CAP-PLAN-MRP
  - CAP-O2C-COLLECTIONS
preconditions:
  - At least one purchased part with a documented lead time.
  - The current or near-future test date can be set to early March of
    a leap year.
steps:
  - n: 1
    action: |
      Set up (or use) a part with a 30-day lead time. Create a demand
      with a need date of March 30 in a leap year.
    expected: |
      Demand record accepts.
  - n: 2
    action: |
      Run MRP / planning. Read the recommended order start date.
    expected: |
      Start date is February 29 (March 30 minus 30 calendar days in a
      leap year), NOT February 28 or March 1.
  - n: 3
    action: |
      Run AR aging on March 1 of a leap year against an invoice dated
      January 31 of the same leap year.
    expected: |
      Age computed as 30 days (Jan 31 → Feb 29 → Mar 1 spans 29 days,
      then +1) — the count matches a hand calculation that includes
      Feb 29.
expected_overall: |
  Date arithmetic in planning and aging respects February 29.
pass_criteria: |
  MRP start date matches hand calculation across leap day AND aging
  count includes Feb 29 in the day count.
why_this_matters: |
  Planning and aging math that drops February 29 produces orders one
  day late and aging buckets one day off. Once every four years it
  bites — exactly when nobody is watching for it.
est_minutes: 8
```
