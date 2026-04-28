## EDGE-NEGQTY-002 — Negative on-hand inventory is either prevented or flagged, never silent

```yaml
id: EDGE-NEGQTY-002
title: An inventory transaction that would drive on-hand below zero is blocked or flagged
goal: |
  Verify that the application's policy on negative on-hand inventory
  is explicit — either it blocks the over-issue, or it permits it
  with an immediate visible flag for cycle-count investigation —
  never silent.
roles:
  - Inventory Clerk
  - Production Manager
capabilities:
  - CAP-INV-CORE
  - CAP-MFG-MATL-ISSUE
preconditions:
  - At least one part with a known on-hand quantity (e.g., 10 units).
steps:
  - n: 1
    action: |
      Attempt to issue 12 units of the part to a work order, where
      on-hand is 10.
    expected: |
      The application either:
      (a) blocks the transaction with a clear "insufficient inventory"
      message, OR
      (b) permits it (driving on-hand to -2) and immediately surfaces
      a negative-on-hand alert / report flag.
      The behavior is documented.
  - n: 2
    action: |
      If permitted, run the negative-on-hand exception report.
    expected: |
      The part appears in the report with on-hand = -2.
  - n: 3
    action: |
      If blocked, confirm a workaround path exists for legitimate
      cases (e.g., a specific permission or a pre-receipt to make
      stock available).
    expected: |
      Workaround path is gated by permission and auditable.
expected_overall: |
  Negative on-hand is never silent — either prevented or visibly
  flagged.
pass_criteria: |
  Behavior matches one of the two documented policies AND a silent
  negative on-hand never results.
why_this_matters: |
  Silent negative on-hand is the symptom that indicates a real
  physical-count problem went unaddressed. A system that masks the
  signal makes the underlying problem worse over time.
est_minutes: 8
```
