## P5-ASSET-DEPMETHOD-001 — Alternate depreciation method (declining balance)

```yaml
id: P5-ASSET-DEPMETHOD-001
title: Configure declining-balance depreciation on a fixed asset
goal: |
  Verify the application supports depreciation methods beyond
  straight-line — specifically declining balance (e.g., 200% DB) —
  and that period postings match the method's math.
roles:
  - Controller
flows:
  - period-close
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one fixed asset is being created or can have its method
    changed (typically only at creation).
prerequisite_cases:
  - P3-ASSET-COMM-001
steps:
  - n: 1
    action: |
      Create a new asset with method = 200% declining balance,
      useful life 5 years, cost $10,000.
    expected: |
      Asset saves. Schedule shows year-1 depreciation ≈ $4,000
      (40% of $10,000), year-2 ≈ $2,400 (40% of $6,000 remaining),
      etc.
  - n: 2
    action: |
      Run period depreciation for the first period.
    expected: |
      Posting equals (year-1 depreciation / 12) for a monthly close.
  - n: 3
    action: |
      Verify GL posting is correct.
    expected: |
      Depreciation expense and accumulated depreciation post per the
      method.
expected_overall: |
  Declining-balance depreciation works correctly.
pass_criteria: |
  Schedule matches method math AND period posting equals expected
  amount.
est_minutes: 8
notes: |
  Many ERPs ship straight-line only. If declining balance is not
  available, that's a real limitation — flag rather than soften.
```
