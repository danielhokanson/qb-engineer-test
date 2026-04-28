## P3-PHYS-001 — Annual physical inventory count

```yaml
id: P3-PHYS-001
title: Run a full physical inventory count and reconcile to system on-hand
goal: |
  Verify the application supports a full physical inventory: freeze
  movement, count every part, capture variances, post adjustments to
  reconcile system on-hand with physical reality.
roles:
  - Warehouse / Logistics
  - Controller
flows:
  - cycle-count
capabilities:
  - CAP-INV-PHYSICAL
  - CAP-INV-CORE
preconditions:
  - At least 5 parts have on-hand inventory.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Find the physical inventory area. Initiate a new physical count
      with a count date.
    expected: |
      Inventory movement is frozen (or warned) for the duration of
      the count. Count sheets are generated covering every part.
  - n: 2
    action: |
      Enter physical counts for each part. Some match system, some
      have variance.
    expected: |
      All counts capture. Variances are highlighted.
  - n: 3
    action: |
      Approve and post adjustments.
    expected: |
      System on-hand updates to match physical. GL postings reflect
      shrinkage (variance value to a variance account).
  - n: 4
    action: |
      Movement freeze lifts.
    expected: |
      Normal operations resume.
expected_overall: |
  Physical inventory reconciles, variances post, freeze releases.
pass_criteria: |
  All parts counted AND variances posted AND GL shrinkage account
  reflects the variance value.
est_minutes: 15
negative_variants:
  - id: P3-PHYS-001-N1
    title: Movement freeze blocks shipments and receipts
    action: |
      During the freeze, attempt a shipment and a vendor receipt.
    expected: |
      Both are blocked with a clear "physical count in progress"
      message until the freeze lifts.
    pass_criteria: |
      No movement transactions complete during the freeze.
  - id: P3-PHYS-001-N2
    title: Cannot post adjustments without counts for every part
    action: |
      Try to approve adjustments while leaving some parts uncounted.
    expected: |
      The action is blocked with a clear list of parts still
      requiring counts.
    pass_criteria: |
      Posting refused until coverage is complete.
```
