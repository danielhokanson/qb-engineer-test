## P4-WOVAR-001 — WO variance review at close

```yaml
id: P4-WOVAR-001
title: Review and explain WO variance before closing the work order
goal: |
  Verify that when a WO closes, the system surfaces material and
  labor variance vs. standard, and the user can attach a variance
  reason before the close commits.
roles:
  - Production Manager
  - Controller
flows:
  - quote-to-cash
preconditions:
  - A WO has completed all operations and is ready to close.
prerequisite_cases:
  - P4-COMP-FINAL
steps:
  - n: 1
    action: |
      Open a completed WO ready to close. Open the variance summary.
    expected: |
      Material variance (actual issue cost - standard BOM cost),
      labor variance (actual hours × rate - standard hours × rate),
      and total cost variance are all shown.
  - n: 2
    action: |
      For non-zero variance, attach a reason code (e.g., "Setup
      scrap higher than standard").
    expected: |
      Reason saves on the WO.
  - n: 3
    action: |
      Close the WO.
    expected: |
      WO closes. Variance posts to the appropriate variance accounts
      (material variance, labor variance) per the costing model.
expected_overall: |
  WO variance is surfaced, explained, and posted to GL.
pass_criteria: |
  Variance correct AND reason captured AND GL postings tie.
est_minutes: 8
```
