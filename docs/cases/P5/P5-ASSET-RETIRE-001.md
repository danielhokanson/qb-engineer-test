## P5-ASSET-RETIRE-001 — Retire / dispose of a fixed asset

```yaml
id: P5-ASSET-RETIRE-001
title: Retire a fixed asset (dispose, scrap, sell)
goal: |
  Verify retirement of a fixed asset stops further depreciation,
  posts the appropriate gain or loss on disposal, and removes the
  asset from operational lists (PM scheduling, work order references).
roles:
  - Controller
  - Maintenance Manager
flows:
  - period-close
capabilities:
  - CAP-MAINT-ASSETLIFECYCLE
  - CAP-ACCT-DEPRECIATION
preconditions:
  - At least one fixed asset has been depreciating (P5-CLOSE-003).
prerequisite_cases:
  - P5-CLOSE-003
steps:
  - n: 1
    action: |
      Open the asset. Use the retire / dispose action. Choose method:
      "Sold" with proceeds = $5,000.
    expected: |
      Retirement is staged. The application computes net book value
      vs. proceeds and shows the resulting gain or loss.
  - n: 2
    action: |
      Confirm.
    expected: |
      Asset transitions to Retired. GL impact: cost and accumulated
      depreciation cleared, cash debited for proceeds, and gain or
      loss posted to the right account.
  - n: 3
    action: |
      Run period depreciation again.
    expected: |
      The retired asset is excluded — no further depreciation posts.
  - n: 4
    action: |
      Try to schedule a PM against the retired asset.
    expected: |
      Operation is blocked with a clear "asset retired" message.
expected_overall: |
  Retirement stops depreciation, posts disposal gain/loss, and gates
  operational use.
pass_criteria: |
  Asset retired AND gain/loss posted AND no further depreciation AND
  PM scheduling blocked.
est_minutes: 8
```
