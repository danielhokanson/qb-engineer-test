## P5-ASSET-XFER-001 — Transfer a fixed asset between locations

```yaml
id: P5-ASSET-XFER-001
title: Transfer a fixed asset to another location with audit trail
goal: |
  Verify a fixed asset can be transferred to a different location and
  / or work center, the transfer is recorded with date and reason,
  and depreciation continues uninterrupted.
roles:
  - Maintenance Manager
  - Controller
flows:
  - foundational-records
preconditions:
  - At least one fixed asset exists at a known location (P1-ASSET-001).
  - At least two locations exist (P1-LOC-002).
prerequisite_cases:
  - P1-ASSET-001
  - P1-LOC-002
steps:
  - n: 1
    action: |
      Open the asset Press 1. Use the transfer / move action. Set
      destination location and effective date.
    expected: |
      Transfer is accepted. Asset's current location updates.
  - n: 2
    action: |
      Open the asset's history.
    expected: |
      Transfer event recorded with date, prior location, new location,
      reason, and actor.
  - n: 3
    action: |
      Run period depreciation. Verify the asset still depreciates on
      its existing schedule (no reset).
    expected: |
      Depreciation continues per the same schedule.
expected_overall: |
  Asset transfer changes location without disrupting financials.
pass_criteria: |
  Location updated AND history captures the transfer AND depreciation
  schedule unchanged.
est_minutes: 6
```
