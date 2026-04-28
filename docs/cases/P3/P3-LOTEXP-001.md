## P3-LOTEXP-001 — Lot expiry tracking and FEFO consumption

```yaml
id: P3-LOTEXP-001
title: Lots track expiry dates and the system consumes FEFO
goal: |
  Verify that lot-tracked materials with expiry dates are tracked,
  the system warns or blocks consumption of expired lots, and
  picking defaults to first-expiry-first-out (FEFO).
roles:
  - Warehouse / Logistics
  - QC Inspector
flows:
  - part-to-inventory
capabilities:
  - CAP-INV-LOTS
preconditions:
  - At least one lot-tracked part exists with two open lots that
    have different expiry dates (one nearer, one further).
prerequisite_cases:
  - P2-PART-003
  - P3-RECV-001
steps:
  - n: 1
    action: |
      Open the part. View the lot detail.
    expected: |
      Each lot shows its expiry date.
  - n: 2
    action: |
      Issue / pick the part for a WO.
    expected: |
      The system defaults to the nearer-expiry lot (FEFO). The user
      can override but must do so explicitly.
  - n: 3
    action: |
      Backdate or adjust one lot to expired. Try to issue from it.
    expected: |
      The system blocks or warns clearly that the lot is expired.
expected_overall: |
  Lot expiry is tracked and FEFO consumption is enforced.
pass_criteria: |
  Expiry visible per lot AND FEFO default applies AND expired-lot
  consumption is blocked or warned.
est_minutes: 8
negative_variants:
  - id: P3-LOTEXP-001-N1
    title: Reject lot with expiry before manufacture date
    action: |
      Try to record a lot whose expiry date precedes its manufacture
      date.
    expected: |
      Save is blocked with a clear "expiry must be after manufacture"
      message.
    pass_criteria: |
      Inverted dates refused.
  - id: P3-LOTEXP-001-N2
    title: FEFO override requires reason
    action: |
      During issue, pick a later-expiry lot when an earlier one is
      available, with no override reason recorded.
    expected: |
      Save is blocked or surfaces a prompt requiring an explicit
      override reason.
    pass_criteria: |
      FEFO override is auditable.
```
