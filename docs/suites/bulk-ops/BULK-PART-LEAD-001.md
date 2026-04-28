## BULK-PART-LEAD-001 — Mass-update lead times by vendor

```yaml
id: BULK-PART-LEAD-001
title: Bulk-update purchase lead time on parts sourced from one vendor
goal: |
  Verify a buyer can mass-update lead time on every part assigned
  to a primary vendor in a single action, that the change flows to
  MRP planning logic, and the operation reports per-part outcome.
roles:
  - Procurement
  - Buyer
capabilities:
  - CAP-MD-PARTS
  - CAP-PLAN-MRP
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 8 parts exist with the same primary vendor.
  - MRP / planning is configured for those parts.
steps:
  - n: 1
    action: |
      Open the parts list. Filter to "primary vendor = ACME Steel."
      Select all. Choose mass-update lead time. Set lead time to
      21 days.
    expected: |
      Stage screen shows old lead time and new lead time per row.
  - n: 2
    action: |
      Confirm.
    expected: |
      Update completes. All filtered parts now show lead time of
      21 days. Summary reports rows updated.
  - n: 3
    action: |
      Run MRP / supply planning. Spot-check the planned-order
      release dates on one of the affected parts.
    expected: |
      Suggested release dates reflect the new 21-day lead time.
expected_overall: |
  Lead-time bulk update propagates into planning math.
pass_criteria: |
  All filtered parts updated AND MRP reflects new lead time AND no
  unrelated parts changed.
est_minutes: 8
```
