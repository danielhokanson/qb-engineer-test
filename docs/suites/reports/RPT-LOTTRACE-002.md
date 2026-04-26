## RPT-LOTTRACE-002 — Backward lot trace from finished serial to raw lots

```yaml
id: RPT-LOTTRACE-002
title: Backward lot trace from finished serial walks back to all source raw lots
goal: |
  Run the backward (genealogy) lot trace report from a finished
  serial number. Verify the trace lists every raw-material lot
  consumed in the WO that produced it, with quantities matching
  the issue records.
roles:
  - QC Inspector
  - Warehouse / Logistics
preconditions:
  - A finished serial has been produced from a WO that consumed
    multiple raw lots (P4-COMP-FINAL with multi-component BOM).
prerequisite_cases:
  - P4-MATL-ISSUE
  - P4-COMP-FINAL
  - RPT-LOTTRACE-001
steps:
  - n: 1
    action: |
      Open the lot trace report and select backward direction from
      the finished serial.
    expected: |
      Report shows the producing WO, then the raw-material lots
      consumed by that WO with quantities.
  - n: 2
    action: |
      Compare the listed raw lots to the WO's material issue
      records (P4-MATL-ISSUE).
    expected: |
      Same lots, same issue quantities.
  - n: 3
    action: |
      Pick one raw lot in the trace. Confirm its receipt PO and
      vendor are correct (drill-through if available).
    expected: |
      Receipt info matches the lot record.
  - n: 4
    action: |
      Confirm a raw lot that was NOT consumed by this WO does NOT
      appear in the trace.
    expected: |
      Excluded.
expected_overall: |
  Backward trace correctly identifies every source lot for the
  finished serial with matching quantities.
pass_criteria: |
  Trace's source lot list matches WO issue records exactly AND
  unrelated lots are excluded.
why_this_matters: |
  Quality root-cause investigations start here. A backward trace
  that misses a contaminated source lot wastes investigation time
  and risks more incidents.
est_minutes: 12
```
