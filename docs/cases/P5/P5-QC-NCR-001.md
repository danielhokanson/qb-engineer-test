## P5-QC-NCR-001 — Non-conformance report (NCR) on rejected material

```yaml
id: P5-QC-NCR-001
title: Open an NCR on rejected material and route for disposition
goal: |
  Verify that material failing inspection generates a non-conformance
  report capturing the defect, that the NCR routes for disposition
  (rework / scrap / use-as-is / RTV), and that the chosen disposition
  drives the inventory and GL outcome.
roles:
  - QC Inspector
  - Production Manager
  - Engineer / R&D
flows:
  - part-to-inventory
preconditions:
  - At least one inspection has failed (P5-QC-INSPECT-001).
prerequisite_cases:
  - P5-QC-INSPECT-001
steps:
  - n: 1
    action: |
      From a failed inspection, create an NCR. Capture: part, lot,
      quantity, defect description, photos.
    expected: |
      NCR saves with a stable ID. Affected stock is in quarantine.
  - n: 2
    action: |
      Route to MRB (Material Review Board) or equivalent. Record a
      disposition: "Use as-is" with engineer signoff.
    expected: |
      Disposition saves with the engineer's name and timestamp.
  - n: 3
    action: |
      Verify the disposition is acted on: stock moves out of
      quarantine to available (use-as-is) or to scrap, return-to-
      vendor, etc.
    expected: |
      Inventory state matches disposition. GL impact (if scrap or
      RTV) posts to the right account.
expected_overall: |
  NCR captures the issue, drives a disposition, and the disposition
  is enacted.
pass_criteria: |
  NCR exists AND disposition recorded with signoff AND inventory /
  GL match disposition.
est_minutes: 10
```
