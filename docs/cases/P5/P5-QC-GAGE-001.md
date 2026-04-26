## P5-QC-GAGE-001 — Gage / measurement device calibration tracking

```yaml
id: P5-QC-GAGE-001
title: Track gage calibration; out-of-cal gages cannot be used for inspection
goal: |
  Verify that measurement devices (calipers, micrometers, CMMs, etc.)
  have calibration records; using an out-of-cal gage for inspection
  is blocked or flagged.
roles:
  - QC Inspector
flows:
  - part-to-inventory
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - The inspection plan from P5-QC-INSPECT-001 references measurement
    tools.
prerequisite_cases:
  - P5-QC-INSPECT-001
steps:
  - n: 1
    action: |
      Find the gage / device area. Create a gage record:
      - ID: GAGE-CAL-001
      - Type: digital caliper
      - Last cal: 6 months ago
      - Next cal due: 6 months from last cal
    expected: |
      Gage saves.
  - n: 2
    action: |
      Verify the gage's status shows "Calibrated" with the next-due
      date.
    expected: |
      Status correct.
  - n: 3
    action: |
      Backdate the next-cal-due to yesterday (so the gage is now
      out-of-cal). Try to use the gage on an inspection.
    expected: |
      The application blocks or warns clearly that the gage is
      out-of-calibration. The user cannot silently use it.
  - n: 4
    action: |
      Record a calibration event with current date and certificate.
    expected: |
      Status returns to "Calibrated." Next-due rolls forward.
expected_overall: |
  Gage calibration is tracked and out-of-cal usage is gated.
pass_criteria: |
  Gage status accurate AND out-of-cal blocks / warns AND new cal
  event resets status.
est_minutes: 8
```
