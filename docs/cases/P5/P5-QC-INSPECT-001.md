## P5-QC-INSPECT-001 — Define an inspection plan and apply it to incoming receipts

```yaml
id: P5-QC-INSPECT-001
title: Create an inspection plan and apply it to vendor receipts
goal: |
  Define an inspection plan for a part (sample size, tests, accept
  criteria) and verify that incoming receipts of the part trigger an
  inspection task before stock becomes available.
roles:
  - QC Inspector
  - Engineer / R&D
flows:
  - part-to-inventory
capabilities:
  - CAP-QC-INSPECTION
  - CAP-P2P-RECEIVE
  - CAP-INV-CORE
preconditions:
  - At least one purchased raw material exists.
prerequisite_cases:
  - P2-PART-001
steps:
  - n: 1
    action: |
      Find the inspection plans area. Create a plan for
      RM-STEEL-1018-3X3:
      - Sample: 5% of receipt, minimum 5
      - Tests: dimensional check, visual surface check
      - Accept criteria: zero rejections in sample
    expected: |
      Plan saves and is associated with the part.
  - n: 2
    action: |
      Receive a PO for the part (per P3-RECV-001 flow).
    expected: |
      Stock arrives in a "pending inspection" status, NOT directly
      available.
  - n: 3
    action: |
      Open the QC inspection queue. Pick up the inspection task.
      Record the dimensional check and visual check as pass.
    expected: |
      Inspection completes. Stock moves from pending to available.
  - n: 4
    action: |
      Repeat with a sample failure.
    expected: |
      Stock either stays in quarantine or routes to NCR (P5-QC-NCR-001).
expected_overall: |
  Inspection plans gate stock availability based on real QC outcomes.
pass_criteria: |
  Plan applied AND stock gated AND pass / fail outcomes drive
  disposition.
est_minutes: 12
```
